import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins/magic-link";
import { sendMagicLinkEmail } from "../../lib/shop/emails";
import { prisma } from "../../lib/prisma";

function isLocalhostEnv() {
  if (process.env.NODE_ENV === "production") return false;
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    process.env.NEXTAUTH_URL ||
    "";
  if (!base) return process.env.NODE_ENV === "development";
  return /localhost|127\.0\.0\.1/i.test(base);
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: { type: "string", input: false, defaultValue: "USER" },
    },
  },
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  session: { 
    expiresIn: 60 * 60 * 24 * 7,
    create: async ({ user }: { user: { id: string } }) => {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      return {
        ...user,
        role: dbUser?.role || 'USER',
      };
    },
  },
  rateLimit: isLocalhostEnv() ? { enabled: false, storage: "memory" } : { storage: "memory" },
  logger: { level: "debug" },
  onAPIError: {
    throw: false,
    onError: (e) => {
      console.error("[BetterAuth] API error:", e);
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [
    // Buyers sign in to My account by email link; first use creates a plain USER account (no staff access).
    magicLink({
      expiresIn: 60 * 15,
      storeToken: "hashed",
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail(email, url);
      },
    }),
    nextCookies(),
  ],
});

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../../lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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
  rateLimit: { storage: "memory" },
  logger: { level: "debug" },
  onAPIError: {
    throw: false,
    onError: (e) => {
      // Surface the underlying error in server logs for debugging
      console.error("[BetterAuth] API error:", e);
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [nextCookies()],
});
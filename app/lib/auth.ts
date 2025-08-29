import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../../lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // Ensure role is included on the client session user
  user: {
    additionalFields: {
      role: { type: "string" },
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
  rateLimit: { storage: "memory" },
  logger: { level: "debug" },
  onAPIError: {
    throw: false,
    onError: (e) => {
      console.error("[BetterAuth] API error:", e);
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [nextCookies()],
});
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
  }

  interface Session {
    user: User;
    accessToken?: string;
    accountId?: string;
    userId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accountId?: string;
    userId?: string;
  }
}
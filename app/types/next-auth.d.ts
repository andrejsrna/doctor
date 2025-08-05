import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    accountId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accountId?: string;
  }
}

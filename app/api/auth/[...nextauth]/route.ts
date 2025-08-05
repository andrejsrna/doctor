import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "1", name: "Admin" };
        }
        return null;
      },
    }),
    {
      id: "instagram",
      name: "Instagram",
      type: "oauth",
      authorization: {
        url: "https://api.instagram.com/oauth/authorize",
        params: {
          scope: "user_profile,user_media",
          response_type: "code",
        },
      },
      token: {
        url: "https://api.instagram.com/oauth/access_token",
        async request({ params }) {
          const response = await fetch("https://api.instagram.com/oauth/access_token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: process.env.INSTAGRAM_CLIENT_ID!,
              client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
              grant_type: "authorization_code",
              redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`,
              code: params.code!,
            }),
          });
          
          const data = await response.json();
          return { tokens: data };
        },
      },
      userinfo: {
        url: "https://graph.instagram.com/me",
        params: {
          fields: "id,username",
        },
        async request({ tokens }) {
          const response = await fetch(
            `https://graph.instagram.com/me?fields=id,username&access_token=${tokens.access_token}`
          );
          return await response.json();
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: null,
        };
      },
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    },
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.accountId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.accountId = token.accountId as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };

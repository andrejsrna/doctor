import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        turnstileToken: { label: "Turnstile Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Check if we're in development mode and bypass Turnstile
        const isDevelopment = process.env.NODE_ENV === 'development';
        const isDevBypass = credentials.turnstileToken === 'dev-bypass';

        if (!isDevelopment && !credentials?.turnstileToken) {
          return null;
        }

        // Only verify Turnstile in production or if not using dev bypass
        if (!isDevelopment || !isDevBypass) {
          try {
            const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                secret: process.env.CF_TURNSTILE_SECRET_KEY,
                response: credentials.turnstileToken,
              }),
            });

            const turnstileData = await turnstileResponse.json();

            if (!turnstileData.success) {
              console.error("Turnstile verification failed:", turnstileData);
              return null;
            }
          } catch (error) {
            console.error("Turnstile verification failed:", error);
            return null;
          }
        }

        if (
          credentials.username === process.env.ADMIN_USERNAME &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { 
            id: "1", 
            name: "Admin",
            email: "admin@dnbdoctor.com"
          };
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
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.accountId = account.providerAccountId;
      }
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.accountId = token.accountId as string;
      session.userId = token.userId as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };

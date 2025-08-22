import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { JWT } from "next-auth/jwt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          avatarUrl: user.avatarUrl,
          accessTokenExpires: Date.now() + 60 * 60 * 1000,
        };
      }

      // Return previous token if the access token has not expired yet.
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          avatarUrl: token.avatarUrl as string,
        };
        session.accessToken = token.accessToken as string;
        session.error = token.error as string | undefined;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the URL starts with "/", it's a relative path
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If the URL has the same origin as baseUrl, allow it
      else if (new URL(url).origin === baseUrl) return url;
      // Default redirect to base URL
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      // After successful sign in, redirect to user's profile
      return true;
    },
  },
});

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    const refreshedToken = await response.json();

    if (!response.ok) {
      throw refreshedToken;
    }

    return {
      ...token,
      accessToken: refreshedToken.token,
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
      refreshToken: refreshedToken.token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Refresh access token error:", error);
    return {
      ...token,
      error: error as string,
    };
  }
}

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { usersService } from "@/services/users";
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
          avatarUrl: user.avatarUrl,
          darkMode: user.darkMode,
          refreshToken: user.refreshToken,
          accessTokenExpires: decodeJWT(user.accessToken),
        };
      }

      if (!token.accessTokenExpires) {
        return token;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Handle refresh token errors
      if (token.error === "RefreshAccessTokenError") {
        session.error = token.error;
        return session;
      }

      // Add safety check
      if (token && token.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          avatarUrl: token.avatarUrl as string,
          darkMode: token.darkMode as boolean,
        };
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
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
    async signIn({}) {
      // If the user is already logged in, return early
      return true;
    },
  },
});

async function refreshAccessToken(token: JWT) {
  try {
    console.log("Refreshing token");

    const res = await usersService.refreshToken(token.refreshToken);

    return {
      ...token,
      accessToken: res.access_token,
      accessTokenExpires: decodeJWT(res.access_token),
      error: undefined,
    };
  } catch (error) {
    console.error("Refresh access token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// function getJwtExpirationDate(jwt: string): D {}

function decodeJWT(jwt: string): number {
  try {
    const payload = jwt.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    return decoded.exp * 1000;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return Date.now();
  }
}

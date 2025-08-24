import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      avatarUrl: string;
      darkMode: boolean;
    } & DefaultSession["user"];
    accessToken: string;
    refreshToken: string;
    error?: string;
  }

  interface User extends DefaultUser {
    id: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    avatarUrl: string;
    darkMode: boolean;
    exists?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    avatarUrl: string;
    darkMode: boolean;
    error?: string;
  }
}

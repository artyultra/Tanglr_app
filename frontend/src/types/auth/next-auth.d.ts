import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      avatarUrl: string;
      darkMode: boolean;
      following: number;
      followers: number;
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
    following: number;
    followers: number;
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
    following: number;
    followers: number;
    error?: string;
  }
}

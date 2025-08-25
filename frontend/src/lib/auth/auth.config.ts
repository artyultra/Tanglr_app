import { usersService } from "@/services/users";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export default {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { username, password } = validatedFields.data;

        try {
          // Call your Go backend login endpoint
          console.log("[Auth] Attempting login for user:", username);
          const res = await usersService.login(username, password);

          // Return user object that will be saved in JWT
          return {
            id: res.id,
            username: res.username,
            email: res.email,
            createdAt: res.created_at,
            updatedAt: res.updated_at,
            avatarUrl: res.avatar_url,
            coverUrl: res.cover_url,
            darkMode: res.dark_mode,
            following: res.following,
            followers: res.followers,
            exists: res.exists,
            accessToken: res.token,
            refreshToken: res.refresh_token,
          };
        } catch (error) {
          console.error("[Auth] Login error:", error);
          return null;
        }
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

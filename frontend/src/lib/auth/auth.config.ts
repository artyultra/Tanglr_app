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
          const response = await fetch(`${process.env.API_BASE_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          const responseText = await response.text();
          console.log("[Auth] Response status:", response.status);
          console.log("[Auth] Response body:", responseText);

          if (!response.ok) {
            console.error("[Auth] Login failed with status:", response.status);
            return null;
          }

          const data = JSON.parse(responseText);

          // Return user object that will be saved in JWT
          return {
            id: data.id,
            username: data.username,
            email: data.email,
            accessToken: data.token,
            refreshToken: data.refresh_token,
            avatarUrl: data.avatar_url || "",
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

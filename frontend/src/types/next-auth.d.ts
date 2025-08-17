// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      accessToken?: string;
      refreshToken?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    createdAt?: string;
    updatedAt?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

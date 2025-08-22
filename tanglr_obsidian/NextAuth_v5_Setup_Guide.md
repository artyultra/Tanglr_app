# NextAuth v5 Setup Guide for Tanglr

## Overview

This guide provides detailed instructions for setting up NextAuth v5 in your Next.js application with your custom Go backend. NextAuth v5 (Auth.js) is the latest version that provides better App Router support and improved TypeScript integration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Project Structure](#project-structure)
4. [Configuration](#configuration)
5. [Credentials Provider Setup](#credentials-provider-setup)
6. [Backend Integration](#backend-integration)
7. [Frontend Implementation](#frontend-implementation)
8. [Middleware Configuration](#middleware-configuration)
9. [Session Management](#session-management)
10. [Protected Routes](#protected-routes)
11. [API Route Protection](#api-route-protection)
12. [TypeScript Types](#typescript-types)
13. [Testing](#testing)
14. [Common Issues & Solutions](#common-issues--solutions)

## Prerequisites

- Next.js 15.4.6 (already installed)
- Node.js 18+ 
- Your Go backend running on port 8080
- PostgreSQL database

## Installation

### 1. Update NextAuth to v5

Since you have NextAuth v4 installed, first uninstall it and install v5:

```bash
cd frontend
npm uninstall next-auth
npm install next-auth@beta @auth/core
```

### 2. Generate AUTH_SECRET

Generate a secure secret for JWT signing:

```bash
openssl rand -hex 32
```

### 3. Create Environment Variables

Create or update `frontend/.env.local`:

```env
# NextAuth Configuration
AUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080

# OAuth Providers (optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   ├── (protected)/
│   │   │   ├── layout.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── auth/
│   │       ├── auth.config.ts
│   │       └── auth.ts
│   ├── middleware.ts
│   └── types/
│       └── next-auth.d.ts
```

## Configuration

### 1. Create Auth Configuration (`src/lib/auth/auth.config.ts`)

```typescript
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { z } from "zod"

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

export default {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials)
        
        if (!validatedFields.success) {
          return null
        }

        const { username, password } = validatedFields.data

        try {
          // Call your Go backend login endpoint
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()

          // Return user object that will be saved in JWT
          return {
            id: data.id,
            username: data.username,
            email: data.email,
            accessToken: data.token,
            refreshToken: data.refresh_token,
            avatarUrl: data.avatar_url,
          }
        } catch (error) {
          console.error("Login error:", error)
          return null
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
} satisfies NextAuthConfig
```

### 2. Create Main Auth File (`src/lib/auth/auth.ts`)

```typescript
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { JWT } from "next-auth/jwt"
import { Session, User } from "next-auth"

export const { 
  handlers, 
  auth, 
  signIn, 
  signOut 
} = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour to match your backend JWT expiration
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user && account) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          avatarUrl: user.avatarUrl,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to refresh it
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          avatarUrl: token.avatarUrl as string,
        }
        session.accessToken = token.accessToken as string
        session.error = token.error as string | undefined
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
})

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.refreshToken}`,
      },
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.token,
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error("Error refreshing access token", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}
```

### 3. Create API Route Handler (`src/app/api/auth/[...nextauth]/route.ts`)

```typescript
import { handlers } from "@/lib/auth/auth"

export const { GET, POST } = handlers
```

## Credentials Provider Setup

### Custom Login Form (`src/app/(auth)/login/page.tsx`)

```typescript
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await signIn("credentials", {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid username or password")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
            <Link
              href="/register"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Create account
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                GitHub
              </button>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
```

### Registration Form (`src/app/(auth)/register/page.tsx`)

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // Register with your backend
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Registration failed")
      }

      // Auto sign in after successful registration
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Registration successful but login failed. Please sign in manually.")
        router.push("/login")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                minLength={3}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (min 6 characters)"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/login"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

## Backend Integration

### API Client with Auth (`src/lib/api/client.ts`)

```typescript
import { getSession } from "next-auth/react"

class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  }

  private async getHeaders(): Promise<HeadersInit> {
    const session = await getSession()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (session?.accessToken) {
      headers["Authorization"] = `Bearer ${session.accessToken}`
    }

    return headers
  }

  async get(endpoint: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  async post(endpoint: string, data: any) {
    const headers = await this.getHeaders()
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  async put(endpoint: string, data: any) {
    const headers = await this.getHeaders()
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  async delete(endpoint: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.ok
  }
}

export const apiClient = new APIClient()
```

## Frontend Implementation

### Auth Provider (`src/components/auth/AuthProvider.tsx`)

```typescript
"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  )
}
```

### Root Layout (`src/app/layout.tsx`)

```typescript
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tanglr",
  description: "Social networking platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
```

### useAuth Hook (`src/hooks/auth/useAuth.ts`)

```typescript
"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const login = useCallback(
    async (username: string, password: string) => {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push("/dashboard")
        router.refresh()
      }

      return result
    },
    [router]
  )

  const logout = useCallback(async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }, [router])

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    logout,
    update,
  }
}
```

## Middleware Configuration

### Middleware (`src/middleware.ts`)

```typescript
import { auth } from "@/lib/auth/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
                     req.nextUrl.pathname.startsWith("/register")
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard") ||
                           req.nextUrl.pathname.startsWith("/profile")
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")

  // Allow auth API routes
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Protect routes that require authentication
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
```

## Protected Routes

### Protected Layout (`src/app/(protected)/layout.tsx`)

```typescript
import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return <>{children}</>
}
```

### Protected Page Example (`src/app/(protected)/dashboard/page.tsx`)

```typescript
import { auth } from "@/lib/auth/auth"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Welcome, {session?.user?.username}!</h2>
        <p className="text-gray-600">Email: {session?.user?.email}</p>
        <p className="text-gray-600">User ID: {session?.user?.id}</p>
      </div>
    </div>
  )
}
```

## API Route Protection

### Protected API Route Example (`src/app/api/user/profile/route.ts`)

```typescript
import { auth } from "@/lib/auth/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch user profile from your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${session.user.id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch profile")
    }

    const profile = await response.json()
    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Update user profile in your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${session.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error("Failed to update profile")
    }

    const updatedProfile = await response.json()
    return NextResponse.json(updatedProfile)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
```

## TypeScript Types

### NextAuth Type Extensions (`src/types/next-auth.d.ts`)

```typescript
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      email: string
      avatarUrl: string
    } & DefaultSession["user"]
    accessToken: string
    error?: string
  }

  interface User extends DefaultUser {
    id: string
    username: string
    email: string
    accessToken: string
    refreshToken: string
    avatarUrl: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    username: string
    email: string
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    avatarUrl: string
    error?: string
  }
}
```

## Testing

### Testing Authentication

```typescript
// __tests__/auth.test.ts
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { signIn } from "next-auth/react"
import LoginPage from "@/app/(auth)/login/page"

jest.mock("next-auth/react")

describe("Authentication", () => {
  it("should handle successful login", async () => {
    const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
    mockSignIn.mockResolvedValueOnce({
      error: null,
      ok: true,
      status: 200,
      url: "/dashboard",
    })

    render(<LoginPage />)
    
    const usernameInput = screen.getByPlaceholderText("Username")
    const passwordInput = screen.getByPlaceholderText("Password")
    const submitButton = screen.getByText("Sign in")

    fireEvent.change(usernameInput, { target: { value: "testuser" } })
    fireEvent.change(passwordInput, { target: { value: "testpass" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        username: "testuser",
        password: "testpass",
        redirect: false,
      })
    })
  })

  it("should display error on failed login", async () => {
    const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
    mockSignIn.mockResolvedValueOnce({
      error: "CredentialsSignin",
      ok: false,
      status: 401,
      url: null,
    })

    render(<LoginPage />)
    
    const submitButton = screen.getByText("Sign in")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Invalid username or password")).toBeInTheDocument()
    })
  })
})
```

## Common Issues & Solutions

### Issue 1: NEXTAUTH_URL Error
**Error:** `NEXTAUTH_URL` environment variable not set
**Solution:** Ensure `NEXTAUTH_URL=http://localhost:3000` is in your `.env.local`

### Issue 2: Session Not Persisting
**Problem:** User gets logged out frequently
**Solutions:**
1. Check JWT expiration matches your backend
2. Implement refresh token rotation
3. Verify `AUTH_SECRET` is consistent

### Issue 3: TypeScript Errors
**Problem:** Type errors with session or user objects
**Solution:** Ensure `next-auth.d.ts` file is properly configured and TypeScript recognizes it

### Issue 4: OAuth Redirect Issues
**Problem:** OAuth providers not redirecting correctly
**Solutions:**
1. Verify callback URLs in provider dashboards
2. Check `NEXTAUTH_URL` matches your domain
3. Ensure redirect URIs are whitelisted

### Issue 5: CORS Errors with Backend
**Problem:** CORS errors when calling backend API
**Solution:** Configure your Go backend to accept requests from your Next.js frontend:

```go
// In your Go backend
func enableCors(w *http.ResponseWriter) {
    (*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    (*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
    (*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
```

## Production Deployment

### Environment Variables for Production

```env
AUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# OAuth (if using)
GITHUB_CLIENT_ID=your_production_github_id
GITHUB_CLIENT_SECRET=your_production_github_secret
GOOGLE_CLIENT_ID=your_production_google_id
GOOGLE_CLIENT_SECRET=your_production_google_secret
```

### Security Checklist

- [ ] Generate strong `AUTH_SECRET` for production
- [ ] Use HTTPS for all endpoints
- [ ] Implement rate limiting on authentication endpoints
- [ ] Add CSRF protection
- [ ] Validate and sanitize all inputs
- [ ] Implement proper session management
- [ ] Use secure cookies in production
- [ ] Enable audit logging for authentication events
- [ ] Implement account lockout after failed attempts
- [ ] Add two-factor authentication (optional)

## Additional Resources

- [NextAuth.js v5 Documentation](https://authjs.dev)
- [NextAuth.js Migration Guide](https://authjs.dev/getting-started/migrating-to-v5)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

## Support

For issues specific to your implementation:
1. Check the error logs in both frontend and backend
2. Verify all environment variables are set correctly
3. Test authentication flow with the browser's network tab open
4. Check session storage in browser DevTools

For NextAuth.js specific issues:
- [GitHub Issues](https://github.com/nextauthjs/next-auth/issues)
- [Discord Community](https://discord.com/invite/g5gReJf)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next-auth)
# NextAuth.js Setup Guide with Go Backend

## Table of Contents
1. [Installation](#installation)
2. [Folder Structure](#folder-structure)
3. [Environment Variables](#environment-variables)
4. [Core Configuration Files](#core-configuration-files)
5. [Authentication Flow Implementation](#authentication-flow-implementation)
6. [Go Backend Integration](#go-backend-integration)
7. [Testing & Debugging](#testing--debugging)

## Installation

```bash
cd frontend
npm install next-auth
npm install @auth/core
```

## Folder Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts         # NextAuth API route handler
│   │   ├── (auth)/                      # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx             # Login page
│   │   │   ├── register/
│   │   │   │   └── page.tsx             # Register page
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx             # Password reset
│   │   │   └── layout.tsx               # Auth pages layout
│   │   ├── (protected)/                 # Protected routes group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx               # Protected layout with auth check
│   │   └── layout.tsx                   # Root layout
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── config.ts                # NextAuth configuration
│   │   │   ├── options.ts               # NextAuth options
│   │   │   └── index.ts                 # Auth exports
│   │   └── api/
│   │       └── auth-client.ts           # API client for Go backend
│   ├── components/
│   │   └── auth/
│   │       ├── LoginForm.tsx            # Login form component
│   │       ├── RegisterForm.tsx         # Register form component
│   │       ├── AuthProvider.tsx         # Session provider wrapper
│   │       ├── SignOutButton.tsx        # Sign out component
│   │       └── AuthGuard.tsx            # Protected route wrapper
│   ├── hooks/
│   │   └── auth/
│   │       ├── useAuth.ts               # Auth hook
│   │       └── useSession.ts            # Session hook
│   ├── types/
│   │   └── auth/
│   │       ├── next-auth.d.ts           # NextAuth type extensions
│   │       ├── user.ts                  # User types
│   │       └── session.ts               # Session types
│   └── middleware.ts                    # NextAuth middleware for protection
├── .env.local                           # Environment variables
└── next.config.js                       # Next.js configuration
```

## Environment Variables

Create `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars-generate-with-openssl

# Go Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080
API_BASE_URL=http://localhost:8080

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Core Configuration Files

### 1. NextAuth Configuration (`src/lib/auth/config.ts`)

```typescript
import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ 
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials)

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data

        // Call your Go backend
        const res = await fetch(`${process.env.API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        })

        if (!res.ok) return null

        const user = await res.json()
        
        // Return user object that will be saved in JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    newUser: "/register"
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user && account) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
          }
        }
      }

      // Return previous token if the access token has not expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, refresh it
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = token.user as any
      session.accessToken = token.accessToken as string
      session.error = token.error as string | undefined
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  debug: process.env.NODE_ENV === "development"
}

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: token.refreshToken
      })
    })

    const refreshedTokens = await response.json()

    if (!response.ok) throw refreshedTokens

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken
    }
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError"
    }
  }
}
```

### 2. NextAuth Route Handler (`src/app/api/auth/[...nextauth]/route.ts`)

```typescript
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/config"

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
```

### 3. Middleware (`src/middleware.ts`)

```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
                     request.nextUrl.pathname.startsWith("/register")

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return null
  }

  if (!isAuth && request.nextUrl.pathname.startsWith("/dashboard")) {
    let from = request.nextUrl.pathname
    if (request.nextUrl.search) {
      from += request.nextUrl.search
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/register"
  ]
}
```

### 4. Type Definitions (`src/types/auth/next-auth.d.ts`)

```typescript
import "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
    }
    accessToken: string
    error?: string
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    accessToken: string
    refreshToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string
      email: string
      name: string
      image?: string
    }
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    error?: string
  }
}
```

## Authentication Flow Implementation

### 1. Auth Provider (`src/components/auth/AuthProvider.tsx`)

```typescript
"use client"

import { SessionProvider } from "next-auth/react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### 2. Login Form Component (`src/components/auth/LoginForm.tsx`)

```typescript
"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    
    try {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false
      })

      if (result?.error) {
        setError("Invalid email or password")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}
```

### 3. Register Form Component (`src/components/auth/RegisterForm.tsx`)

```typescript
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          name: formData.get("name")
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Registration failed")
        return
      }

      // Auto-login after successful registration
      const { signIn } = await import("next-auth/react")
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false
      })

      router.push("/dashboard")
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  )
}
```

### 4. Custom Register API Route (`src/app/api/auth/register/route.ts`)

```typescript
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Call your Go backend registration endpoint
    const response = await fetch(`${process.env.API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Registration failed" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
```

## Go Backend Integration

### Expected Go Backend Endpoints

Your Go backend should implement these endpoints:

#### 1. Login Endpoint
```
POST /api/auth/login
Body: { "email": "user@example.com", "password": "password123" }
Response: {
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "https://example.com/avatar.jpg",
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

#### 2. Register Endpoint
```
POST /api/auth/register
Body: { "email": "user@example.com", "password": "password123", "name": "User Name" }
Response: {
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "User Name",
  "message": "User created successfully"
}
```

#### 3. Refresh Token Endpoint
```
POST /api/auth/refresh
Body: { "refreshToken": "jwt-refresh-token" }
Response: {
  "accessToken": "new-jwt-access-token",
  "refreshToken": "new-jwt-refresh-token" (optional)
}
```

#### 4. Logout Endpoint (Optional)
```
POST /api/auth/logout
Headers: { "Authorization": "Bearer jwt-access-token" }
Response: { "message": "Logged out successfully" }
```

### API Client for Protected Routes (`src/lib/api/auth-client.ts`)

```typescript
import { getSession } from "next-auth/react"

class AuthClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  }

  private async getHeaders() {
    const session = await getSession()
    
    return {
      "Content-Type": "application/json",
      ...(session?.accessToken && {
        Authorization: `Bearer ${session.accessToken}`
      })
    }
  }

  async get(endpoint: string) {
    const headers = await this.getHeaders()
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async post(endpoint: string, data: any) {
    const headers = await this.getHeaders()
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async put(endpoint: string, data: any) {
    const headers = await this.getHeaders()
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async delete(endpoint: string) {
    const headers = await this.getHeaders()
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }
}

export const authClient = new AuthClient()
```

## Usage Examples

### 1. Using Session in Client Components

```typescript
"use client"

import { useSession } from "next-auth/react"

export function ProfileComponent() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div>Not logged in</div>
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
      <p>Email: {session?.user?.email}</p>
    </div>
  )
}
```

### 2. Using Session in Server Components

```typescript
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth/config"

export default async function DashboardPage() {
  const session = await getServerSession(authConfig)

  if (!session) {
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {session.user.name}</p>
    </div>
  )
}
```

### 3. Protected API Calls

```typescript
"use client"

import { authClient } from "@/lib/api/auth-client"
import { useEffect, useState } from "react"

export function UserPosts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await authClient.get("/api/posts")
        setPosts(data)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div>
      {posts.map((post: any) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

## Testing & Debugging

### 1. Enable Debug Mode

In `.env.local`:
```env
NEXTAUTH_DEBUG=true
```

### 2. Test Authentication Flow

```bash
# Start your Go backend first
cd backend && go run main.go

# In another terminal, start Next.js
cd frontend && npm run dev
```

### 3. Common Issues & Solutions

#### Issue: "NEXTAUTH_URL is not set"
**Solution**: Ensure `.env.local` has `NEXTAUTH_URL=http://localhost:3000`

#### Issue: "Invalid credentials" even with correct password
**Solution**: Check that your Go backend is running and accessible at the configured URL

#### Issue: Session not persisting
**Solution**: Verify `NEXTAUTH_SECRET` is set and consistent across deployments

#### Issue: Middleware not protecting routes
**Solution**: Ensure middleware.ts matcher patterns match your protected routes

### 4. Testing Checklist

- [ ] User can register a new account
- [ ] User can login with credentials
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Authenticated users are redirected away from login/register pages
- [ ] Logout clears session and redirects properly
- [ ] API calls include authentication token
- [ ] Token refresh works when access token expires

## Production Deployment

### 1. Environment Variables for Production

```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate-strong-secret-with-openssl
API_BASE_URL=https://api.yourdomain.com
```

### 2. Security Checklist

- [ ] Use HTTPS in production
- [ ] Generate strong NEXTAUTH_SECRET (minimum 32 characters)
- [ ] Set secure cookie options in production
- [ ] Implement CSRF protection
- [ ] Add rate limiting on authentication endpoints
- [ ] Use secure headers (CSP, HSTS, etc.)
- [ ] Implement proper error handling without exposing sensitive info

### 3. NextAuth Configuration for Production

```typescript
// Additional production settings in authConfig
export const authConfig: NextAuthConfig = {
  // ... existing config
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  trustHost: true // Required for production deployments
}
```

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth.js with Custom Backend](https://next-auth.js.org/configuration/providers/credentials)
- [JWT Token Refresh Pattern](https://next-auth.js.org/tutorials/refresh-token-rotation)
- [TypeScript Configuration](https://next-auth.js.org/getting-started/typescript)
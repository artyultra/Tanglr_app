# Tanglr

> **Connect. Share. Create.**

A modern full-stack social media application built to demonstrate enterprise-level web development practices, featuring real-time interactions, secure authentication, and a polished user experience.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Highlights](#project-highlights)
- [Future Enhancements](#future-enhancements)

## Overview

Tanglr is a social networking platform where users can share posts, follow other users, and manage their profiles with customizable settings. This project showcases my ability to build production-ready applications with modern technologies, implementing best practices in security, database design, and user experience.

**Live Demo:** [Coming Soon]
**Repository:** [github.com/artyultra/tanglr](https://github.com/artyultra/tanglr)

## Features

### Core Functionality

- **User Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Automatic token refresh mechanism with retry logic
  - Secure password hashing with bcrypt
  - Session persistence across browser refreshes

- **User Profiles**
  - Customizable avatars with UploadThing integration
  - Public and private profile modes
  - Dark mode toggle
  - Unique username system

- **Social Features**
  - Create and share posts with visibility controls (public, friends, private)
  - Follow/unfollow users
  - Smart follow system: private accounts require approval, public accounts auto-accept
  - Real-time "time ago" timestamps (e.g., "2h", "3d")

- **Post Management**
  - Rich text posts
  - Pagination support for feeds
  - Soft delete functionality
  - User-specific and global feeds

## Tech Stack

### Backend

- **Go 1.24** - High-performance backend server
- **Chi Router** - Lightweight HTTP router with middleware support
- **PostgreSQL** - Robust relational database
- **JWT (golang-jwt/jwt v5)** - Secure token-based authentication
- **SQLC** - Type-safe SQL queries
- **Goose** - Database migration tool
- **Google Cloud SQL Connector** - Cloud deployment support

### Frontend

- **Next.js 15.4** - React framework with App Router and Server Components
- **React 19** - Modern UI library
- **TypeScript 5** - Type-safe development
- **NextAuth.js 5.0** - Authentication for Next.js applications
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Axios** - HTTP client with interceptors
- **Zod** - Runtime type validation
- **UploadThing** - File upload infrastructure

## Architecture

### Backend Structure

```
backend/
├── handlers/          # HTTP request handlers
├── sql/
│   ├── queries/      # SQL query definitions (SQLC)
│   └── schema/       # Database migrations
├── internal/         # Internal packages
└── main.go          # Application entry point
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (protected)/      # Protected routes
│   │   └── [username]/       # Dynamic user profiles
│   ├── components/           # Reusable UI components
│   ├── lib/
│   │   ├── api/             # API client configuration
│   │   └── auth/            # NextAuth configuration
│   ├── services/            # API service layer
│   └── types/               # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Go 1.24 or higher
- Node.js 18+ and npm
- PostgreSQL 14+
- UploadThing account (for avatar uploads)

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/artyultra/tanglr.git
   cd tanglr/backend
   ```

2. **Install Go dependencies**

   ```bash
   go mod download
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/tanglrdb
   PORT=8082
   ENVIRONMENT=development
   JWT_SECRET=your-secure-jwt-secret
   ```

4. **Run database migrations**

   ```bash
   goose -dir sql/schema postgres "${DATABASE_URL}" up
   ```

5. **Start the backend server**
   ```bash
   go run main.go
   ```
   Server will start on `http://localhost:8082`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   AUTH_TRUST_HOST=true
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXT_PUBLIC_API_URL=http://localhost:8082
   API_BASE_URL=http://localhost:8082/v1
   UPLOADTHING_TOKEN=your-uploadthing-token
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will start on `http://localhost:3000`

## API Documentation

### Base URL

```
http://localhost:8082/v1
```

### Authentication Endpoints

#### Register User

```http
POST /users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login

```http
POST /login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword"
}

Response:
{
  "user": { ... },
  "jwt": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Refresh Token

```http
POST /refresh-token
Authorization: Bearer <refresh_token>

Response:
{
  "jwt": "new_access_token"
}
```

### Posts Endpoints

#### Create Post

```http
POST /posts
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "body": "This is my first post!",
  "visibility": "public"
}
```

#### Get All Posts

```http
GET /posts
```

#### Get User Posts

```http
GET /posts/{username}
```

### User Endpoints

#### Get User Profile

```http
GET /users/{username}
```

#### Update Avatar

```http
PUT /users/me/avatar
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "avatar_url": "https://uploadthing.com/..."
}
```

### Follow Endpoints

#### Follow User

```http
POST /follow
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "target_username": "janedoe"
}
```

## Database Schema

### Users Table

```sql
users (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

### User Preferences Table

```sql
user_preferences (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  dark_mode BOOLEAN DEFAULT true,
  private_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Posts Table

```sql
posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  visibility TEXT DEFAULT 'public',
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Follows Table

```sql
follows (
  initiator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (initiator_id, target_id),
  CHECK (initiator_id != target_id)
)
```

## Project Highlights

### Technical Achievements

1. **Advanced Authentication System**
   - Dual-token strategy (access + refresh tokens) for enhanced security
   - Automatic token refresh with intelligent retry mechanism
   - Session persistence and recovery
   - One refresh token per user enforced at database level

2. **Intelligent Follow System**
   - Private mode requires follow approval (pending status)
   - Public mode auto-accepts follow requests
   - Database transactions ensure data consistency
   - Prevents self-follows with check constraints

3. **Modern Frontend Architecture**
   - Server Components for optimal performance
   - Client Components for rich interactivity
   - Protected routes with server-side authentication
   - Hybrid styling with CSS Modules and TailwindCSS

4. **Type Safety Throughout**
   - Full TypeScript implementation on frontend
   - SQLC for type-safe database queries in Go
   - Zod validation for runtime type checking
   - Strong typing across all API boundaries

5. **Database Optimization**
   - Strategic indexing on high-traffic queries
   - Foreign key constraints with cascade operations
   - Composite primary keys for efficient lookups
   - Soft delete pattern for data recovery

6. **Error Handling & Resilience**
   - Automatic retry logic for transient failures
   - Graceful degradation on token expiration
   - Comprehensive error logging
   - User-friendly error messages

### Development Best Practices

- Clean architecture with separation of concerns
- RESTful API design
- Environment-based configuration
- Database migrations for version control
- Secure password hashing
- CORS configuration for API security
- Modular component structure
- Reusable service layer

## Future Enhancements

- [ ] Real-time notifications using WebSockets
- [ ] Post reactions (likes, comments)
- [ ] Image and video uploads for posts
- [ ] User search functionality
- [ ] Direct messaging system
- [ ] Email verification
- [ ] OAuth integration (Google, GitHub)
- [ ] Hashtag system
- [ ] User mentions (@username)
- [ ] Explore/trending page
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

## Skills Demonstrated

This project showcases my proficiency in:

- Full-stack web development
- RESTful API design and implementation
- Database schema design and optimization
- Authentication and authorization patterns
- Modern React patterns (Server/Client Components)
- TypeScript for type-safe development
- State management and data fetching
- Responsive UI design
- Security best practices
- Git version control
- Cloud deployment readiness

---

**Built with passion by ARYULTRA**
[Portfolio](https://artyultra.dev) | [LinkedIn](https://www.linkedin.com/in/dalton-berg-harris-465a6a394/) | [Email](mailto:arty@artyultra.dev)

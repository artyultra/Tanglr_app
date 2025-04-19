import { Session } from "next-auth";

// Request types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreatePostRequest {
  body: string;
}

// Response types
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: Session["user"];
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
}

export interface CreatePostResponse {
  Body: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Post response types
interface Post {
  id: string;
  body: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  username: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export type GetUserProfileRespone = UserProfile;

export type GetPostsResponse = Post[];

// src/lib/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with types
const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    if (typeof window !== "undefined") {
      const session = (await getSession()) as Session | null;
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

// Define request types
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

export interface CreatePostRequest {
  content: string;
}

export interface CreatePostResponse {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Add user-related API functions with type safety
export const userApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/login", request);
    return response.data;
  },

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>("/users", request);
    return response.data;
  },
  async createPost(request: CreatePostRequest): Promise<CreatePostResponse> {
    const response = await api.post<CreatePostResponse>("/posts", request);
    return response.data;
  },
};

export default api;

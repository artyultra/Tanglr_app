import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { Session } from "next-auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Create axios instance with types
const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  },
});

// Define a variable to track if a refresh is in progress
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}> = [];

// Process the failed queue (either retry all or reject all)
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      // Update the Authorization header with the new token
      request.config.headers.Authorization = `Bearer ${token}`;
      request.resolve(api(request.config));
    }
  });

  // Reset the queue
  failedQueue = [];
};

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

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // If the error is not 401 or the request has already been retried, reject
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Mark this request as retried to prevent infinite loops
    originalRequest._retry = true;

    if (isRefreshing) {
      // If a refresh is already in progress, add this request to the queue
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      // Get the current session to access the refresh token
      const session = (await getSession()) as Session | null;

      if (!session?.user?.refreshToken) {
        // No refresh token available, reject and possibly sign out
        throw new Error("No refresh token available");
      }

      // Call the refresh token endpoint
      const response = await axios.post<{ accessToken: string }>(
        `${baseURL}/refresh_token`,
        { refreshToken: session.user.refreshToken },
      );

      const { accessToken } = response.data;

      // Update the session with the new access token
      // This part depends on how you're storing your session
      // You might need to use a different approach based on your auth setup
      if (typeof window !== "undefined") {
        // Update the session (this is a simplified example)
        // In practice, you'd use the appropriate next-auth methods
        session.user.accessToken = accessToken;

        // Update the original request's Authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process any requests that were queued during the refresh
        processQueue(null, accessToken);
      }

      isRefreshing = false;

      // Retry the original request with the new token
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;

      // Process the queue with an error
      processQueue(refreshError as Error);

      // Sign out the user if refresh token is invalid
      if (typeof window !== "undefined") {
        signOut();
      }

      return Promise.reject(refreshError);
    }
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

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
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
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(
      "/users",
      refreshToken,
    );
    return response.data;
  },
  async createPost(request: CreatePostRequest): Promise<CreatePostResponse> {
    const response = await api.post<CreatePostResponse>("/posts", request);
    return response.data;
  },
};

export default api;

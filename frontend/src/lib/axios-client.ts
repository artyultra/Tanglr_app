import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { Session } from "next-auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Add the type declaration for _retry
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
  },
});

// For token refresh mechanism
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.config.headers.Authorization = `Bearer ${token}`;
      request.resolve(api(request.config));
    }
  });
  failedQueue = [];
};

// Request interceptor
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
  (error: unknown) => {
    return Promise.reject(error);
  },
);

// Response interceptor (token refresh logic)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      const session = (await getSession()) as Session | null;

      if (!session?.user?.refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post<{ accessToken: string }>(
        `${baseURL}/refresh_token`,
        { refreshToken: session.user.refreshToken },
      );

      const { accessToken } = response.data;

      if (typeof window !== "undefined") {
        session.user.accessToken = accessToken;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
      }

      isRefreshing = false;
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      processQueue(refreshError as Error);

      if (typeof window !== "undefined") {
        signOut();
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;

// src/services/users.ts

import { httpClient, ENDPOINTS, STORAGE_KEYS, API_URL } from "@/lib/api";
import {
  createUserSchema,
  type LoginInput,
  type CreateUserInput,
} from "@/lib/validators/users";
import type {
  LoginRequest,
  LoginResponse,
  CreateUserRequest,
  CreateUserResponse,
  RefreshTokenResponse,
  GetUserResponse,
  UpdateAvatarRequest,
} from "@/types/users";

export class UsersService {
  async login(username: string, password: string): Promise<LoginResponse> {
    const requestData: LoginRequest = {
      username: username,
      password: password,
    };

    try {
      const response = await httpClient.post<LoginResponse>(
        ENDPOINTS.AUTH.LOGIN,
        requestData,
        { headers: { "Content-Type": "application/json" } },
      );
      console.log("[UsersService] Login successful, response:", response);

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
        localStorage.setItem(
          STORAGE_KEYS.REFRESH_TOKEN,
          response.refresh_token,
        );
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify({
            id: response.id,
            username: response.username,
            email: response.email,
            avatarUrl: response.avatar_url,
            darkMode: response.dark_mode,
          }),
        );
        console.log("[UsersService] Stored user data in localStorage");
      }

      return response;
    } catch (error) {
      console.error("[UsersService] Login error:", error);
      throw error;
    }
  }

  async createUser(data: CreateUserInput): Promise<CreateUserResponse> {
    const validatedData = createUserSchema.parse(data);

    const requestData: CreateUserRequest = {
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password,
    };

    return httpClient.post<CreateUserResponse>(
      ENDPOINTS.USERS.CREATE,
      requestData,
    );
  }

  async getUser(
    username: string | undefined,
    accessToken?: string,
  ): Promise<GetUserResponse> {
    const options = accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined;
    if (username) {
      return httpClient.get<GetUserResponse>(
        ENDPOINTS.USERS.GET(username),
        options,
      );
    } else {
      throw new Error("Username is undefined");
    }
  }

  async putAvatar(avatarUrl: string, accessToken?: string): Promise<void> {
    const options = accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined;

    const requestData: UpdateAvatarRequest = {
      avatar_url: avatarUrl,
    };

    return httpClient.put<void>(
      ENDPOINTS.USERS.PUT_AVATAR,
      requestData,
      options,
    );
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        : null;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await httpClient.post<RefreshTokenResponse>(
      ENDPOINTS.AUTH.REFRESH_TOKEN,
      null,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    if (typeof window !== "undefined" && response.access_token) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
    }

    return response;
  }

  async revokeToken(): Promise<void> {
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        : null;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    await httpClient.delete(ENDPOINTS.AUTH.REVOKE_TOKEN, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    this.logout();
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  getCurrentUserAvatarUrl(): string | null {
    const user = this.getCurrentUser();
    return user?.avatarUrl || null;
  }

  getCurrentUserDarkMode(): boolean {
    const user = this.getCurrentUser();
    return user?.darkMode ?? true;
  }

  getCurrentUser(): any {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
    return false;
  }
}

export const usersService = new UsersService();

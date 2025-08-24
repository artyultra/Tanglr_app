// src/services/users.ts

import { httpClient, ENDPOINTS, STORAGE_KEYS } from "@/lib/api";
import { createUserSchema, type CreateUserInput } from "@/lib/validators/users";
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
  private updateSessionCallback?: () => Promise<any>;
  private logoutCallback?: () => Promise<void>;

  setSessionUpdateCallback(updateFn: () => Promise<any>) {
    this.updateSessionCallback = updateFn;
  }

  setLogoutCallback(logoutFn: () => Promise<void>) {
    this.logoutCallback = logoutFn;
  }

  private async executeWithAutoRetry<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("Unauthorized"))
      ) {
        console.log("Session expired, refreshing token, ****");

        try {
          if (this.updateSessionCallback) {
            await this.updateSessionCallback();
          } else {
            await this.performManualRefresh();
          }

          return await operation();
        } catch (error) {
          console.error("Error refreshing session:", error);
          this.logoutCallback?.();
          this.logout();
          throw new Error("Session expired and could not be refreshed");
        }
      }

      throw error;
    }
  }

  private async performManualRefresh(): Promise<void> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const refreshRes = await this.refreshToken(refreshToken);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshRes.access_token);
    }
  }

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
    const operation = async () => {
      if (!username) {
        throw new Error("Username is undefined");
      }

      const options = accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined;

      return httpClient.get<GetUserResponse>(
        ENDPOINTS.USERS.GET(username),
        options,
      );
    };
    return this.executeWithAutoRetry(operation);
  }

  async putAvatar(avatarUrl: string, accessToken?: string): Promise<void> {
    const opperation = async () => {
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
    };
    return this.executeWithAutoRetry(opperation);
  }

  async refreshToken(refreshToken?: string): Promise<RefreshTokenResponse> {
    const options = refreshToken
      ? { headers: { Authorization: `Bearer ${refreshToken}` } }
      : undefined;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await httpClient.post<RefreshTokenResponse>(
      ENDPOINTS.AUTH.REFRESH_TOKEN,
      null,
      options,
    );

    return response;
  }

  async revokeToken(): Promise<void> {
    const operation = async () => {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      return httpClient.delete(ENDPOINTS.AUTH.REVOKE_TOKEN, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
    };

    await this.executeWithAutoRetry(operation);
    this.logout();
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    this.updateSessionCallback = undefined;
    this.logoutCallback = undefined;
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

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
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

import { httpClient, ENDPOINTS, STORAGE_KEYS } from "@/lib/api";
import {
  loginSchema,
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
  GetNonFriendsResponse,
  GetFriendsListResponse,
  AddFriendResponse,
} from "@/types/users";

export class UsersService {
  async login(data: LoginInput): Promise<LoginResponse> {
    const validatedData = loginSchema.parse(data);

    const requestData: LoginRequest = {
      username: validatedData.username,
      password: validatedData.password,
    };

    const response = await httpClient.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      requestData,
      { headers: {} },
    );

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify({
          id: response.id,
          username: response.username,
          email: response.email,
        }),
      );
    }

    return response;
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
    username: string,
    accessToken?: string,
  ): Promise<GetUserResponse> {
    const options = accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined;

    return httpClient.get<GetUserResponse>(
      ENDPOINTS.USERS.GET(username),
      options,
    );
  }

  async getNonFriends(username: string): Promise<GetNonFriendsResponse> {
    return httpClient.get<GetNonFriendsResponse>(
      ENDPOINTS.USERS.GET_NON_FRIENDS(username),
    );
  }

  async getFriendsList(username: string): Promise<GetFriendsListResponse> {
    return httpClient.get<GetFriendsListResponse>(
      ENDPOINTS.USERS.GET_FRIENDS_LIST(username),
    );
  }

  async addFriend(
    username: string,
    friendUsername: string,
  ): Promise<AddFriendResponse> {
    return httpClient.post<AddFriendResponse>(
      ENDPOINTS.USERS.ADD_FRIEND(username, friendUsername),
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


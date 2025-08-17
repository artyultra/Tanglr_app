import api from "@/lib/axios-client";
import { AuthTypes, PostTypes, UserTypes } from "@/types/api";

export const userService = {
  async login(
    request: AuthTypes.LoginRequest,
  ): Promise<AuthTypes.LoginResponse> {
    const response = await api.post<AuthTypes.LoginResponse>("/login", request);
    return response.data;
  },

  async register(
    request: AuthTypes.RegisterRequest,
  ): Promise<AuthTypes.RegisterResponse> {
    const response = await api.post<AuthTypes.RegisterResponse>(
      "/users",
      request,
    );
    return response.data;
  },

  async refreshToken(
    refreshToken: string,
  ): Promise<AuthTypes.RefreshTokenResponse> {
    const response = await api.post<AuthTypes.RefreshTokenResponse>(
      "/refresh_token",
      {
        refreshToken,
      },
    );
    return response.data;
  },

  async createPost(
    request: PostTypes.CreatePostRequest,
  ): Promise<PostTypes.CreatePostResponse> {
    const response = await api.post<PostTypes.CreatePostResponse>(
      "/posts",
      request,
    );
    return response.data;
  },
  async getPosts(username: string): Promise<PostTypes.GetPostsResponse> {
    const response = await api.get<PostTypes.GetPostsResponse>(
      `/posts/${username}`,
    );
    return response.data;
  },
  async getUserProfile(
    username: string,
  ): Promise<UserTypes.GetUserProfileResponse> {
    const response = await api.get<UserTypes.GetUserProfileResponse>(
      `/users/${username}`,
    );
    return response.data;
  },
};

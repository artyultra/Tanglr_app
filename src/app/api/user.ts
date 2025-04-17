import api from "./client";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenResponse,
  CreatePostRequest,
  CreatePostResponse,
  GetPostsResponse,
} from "./types";

export const userService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/login", request);
    return response.data;
  },

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>("/users", request);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>("/refresh_token", {
      refreshToken,
    });
    return response.data;
  },

  async createPost(request: CreatePostRequest): Promise<CreatePostResponse> {
    const response = await api.post<CreatePostResponse>("/posts", request);
    return response.data;
  },
  async getPosts(): Promise<GetPostsResponse> {
    const response = await api.get<GetPostsResponse>("/posts");
    return response.data;
  },
};

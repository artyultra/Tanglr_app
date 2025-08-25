export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  avatar_url: string;
  cover_url: string;
  dark_mode: boolean;
  private_mode: boolean;
  followers: number;
  following: number;
  exists?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  avatar_url: string;
  cover_url: string;
  dark_mode: boolean;
  following: number;
  followers: number;
  exists?: boolean;
  token: string;
  refresh_token: string;
}

export interface loginCredentials {
  name: "credentials";
  credentials: {
    username: { label: "Username"; type: "text" };
    password: { label: "Password"; type: "password" };
  };
}

export type GetUserResponse = User;

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export type CreateUserResponse = User;

export interface UpdateAvatarRequest {
  avatar_url: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface UploadThingServerData {
  url: string;
}

export interface UploadThingResponse {
  name: string;
  size: number;
  key: string;
  lastModified?: number; // Made optional since it can be undefined
  serverData: UploadThingServerData;
  url: string;
  appUrl?: string; // Made optional
  ufsUrl: string;
  customId: string | null;
  type: string;
  fileHash?: string; // Made optional
}

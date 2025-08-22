export interface User {
  id?: string;
  username?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
  cover_url?: string;
  dark_mode?: boolean;
  exists: boolean;
}

export interface Friends {
  user_id: string;
  friend_id: string;
  status: string;
  initiator_id: string;
  created_at: string;
  updated_at: string;
}

export interface FriendUser {
  user_id: string;
  friend_id: string;
  status: string;
  initiator_id: string;
  created_at: string;
  updated_at: string;
  friend_username: string;
  friend_avatar_url: string;
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
  exists: boolean;
  token: string;
  refresh_token: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateUserResponse extends User {}

export interface RefreshTokenResponse {
  access_token: string;
}

export type GetUserResponse = User;
export type GetNonFriendsResponse = User[];
export type GetFriendsListResponse = FriendUser[];

export interface AddFriendResponse {
  message: string;
}


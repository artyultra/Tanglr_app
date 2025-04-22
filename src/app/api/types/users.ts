// src/app/api/types/users.ts
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  avatar_url: string;
}

export interface FriendRequestResponse {
  message: string;
}

export type GetUserProfileResponse = UserProfile;
export type GetUserProfileListResponse = UserProfile[];

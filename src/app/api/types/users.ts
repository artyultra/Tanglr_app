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

export interface userFriend {
  user_id: string;
  friend_id: string;
  status: string;
  initiator_id: string;
  created_at: string;
  updated_at: string;
  friend_username: string;
  friend_avatar_url: string;
}

export type GetUserProfileResponse = UserProfile;
export type GetUserProfileListResponse = UserProfile[];
export type GetFriendsListResp = userFriend[];

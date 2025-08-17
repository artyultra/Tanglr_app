import api from "@/lib/axios-client";
import { UserTypes } from "@/types/api";

export const friendsService = {
  async getNonFriendUsers(
    username: string,
  ): Promise<UserTypes.GetUserProfileListResponse> {
    const response = await api.get<UserTypes.GetUserProfileListResponse>(
      `users/${username}/friends`,
    );
    return response.data;
  },
  async submitFriendRequest(
    username: string,
    friendUsername: string,
  ): Promise<UserTypes.FriendRequestResponse> {
    const response = await api.post<UserTypes.FriendRequestResponse>(
      `users/${username}/friends/${friendUsername}`,
    );
    return response.data;
  },
  async getFriendsList(
    username: string,
  ): Promise<UserTypes.GetFriendsListResp> {
    const response = await api.get<UserTypes.GetFriendsListResp>(
      `users/${username}/friendslist`,
    );
    return response.data;
  },
};

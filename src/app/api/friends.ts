import api from "./client";
import { UserTypes } from "./index";

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
};

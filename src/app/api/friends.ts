import api from "./client";
import { GetUserProfileListReponse } from "./types";

export const friendsService = {
  async getNonFriendUsers(
    username: string,
  ): Promise<GetUserProfileListReponse> {
    const response = await api.get<GetUserProfileListReponse>(
      `users/${username}/friends`,
    );
    return response.data;
  },
};

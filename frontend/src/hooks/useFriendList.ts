import { useCallback, useEffect, useState } from "react";
import { friendsService, UserTypes } from "@/services";

export function useFriendList(username: string) {
  const [friendList, setFriendList] = useState<UserTypes.GetFriendsListResp>(
    [],
  );
  const [isLoadingFriendList, setIsLoadingFriendList] =
    useState<boolean>(false);
  const [errorFriendList, setErrorFriendList] = useState<Error | null>(null);

  // Convert to useCallback to stabilize the function reference
  const fetchFriendsList = useCallback(async () => {
    try {
      setIsLoadingFriendList(true);
      const response = await friendsService.getFriendsList(username);
      setFriendList(response);
    } catch (error) {
      setErrorFriendList(error as Error);
    } finally {
      setIsLoadingFriendList(false);
    }
  }, [username]);
  // Effect for fetching users
  useEffect(() => {
    fetchFriendsList();
  }, [fetchFriendsList]);

  return {
    friendList,
    isLoadingFriendList,
    errorFriendList,
  };
}

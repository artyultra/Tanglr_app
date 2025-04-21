import { useEffect, useState } from "react";
import { friendsService } from "@/app/api/friends";
import { GetUserProfileListReponse } from "@/app/api/types";

export function useFriendActions(username: string) {
  const [users, setUsers] = useState<GetUserProfileListReponse>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await friendsService.getNonFriendUsers(username);
      setUsers(response);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
  };
}

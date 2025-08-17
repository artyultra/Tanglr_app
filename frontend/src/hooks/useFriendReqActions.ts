import { useEffect, useState, useCallback } from "react";
import { friendsService, UserTypes } from "@/services";
import { useSession } from "next-auth/react";

export function useFriendActions(username: string) {
  // fetch users
  const [users, setUsers] = useState<UserTypes.GetUserProfileListResponse>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorUsers, setErrorUsers] = useState<Error | null>(null);
  const { status } = useSession();

  const fetchUsers = useCallback(async () => {
    if (status !== "authenticated") {
      return; // Don't make API calls until authenticated
    }

    try {
      setIsLoading(true);
      const response = await friendsService.getNonFriendUsers(username);
      setUsers(response);
    } catch (error) {
      setErrorUsers(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [username, status]); // These dependencies are fine

  useEffect(() => {
    // Only fetch users when authentication is complete
    if (status === "authenticated") {
      fetchUsers();
    }
  }, [status, fetchUsers]); // This is likely creating the loop

  // submit friend request
  const [friendResponse, setFriendResponse] =
    useState<UserTypes.FriendRequestResponse>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorFriendReq, setErrorFriendReq] = useState<Error | null>(null);

  const submitFriendRequest = useCallback(
    async (friendUsername: string) => {
      if (status !== "authenticated") {
        return; // Don't make API calls until authenticated
      }

      try {
        setIsSubmitting(true);
        const response = await friendsService.submitFriendRequest(
          username,
          friendUsername,
        );
        setFriendResponse(response);
      } catch (error) {
        setErrorFriendReq(error as Error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [username, status],
  ); // These dependencies are fine

  return {
    users,
    isLoading,
    errorUsers,
    friendResponse,
    isSubmitting,
    errorFriendReq,
    submitFriendRequest,
  };
}

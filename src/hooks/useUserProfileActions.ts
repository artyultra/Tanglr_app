import { userService } from "@/app/api";
import { GetUserProfileRespone } from "@/app/api/types";
import { useEffect, useState } from "react";

export function useUserProfileActions(username: string) {
  const [user, setUser] = useState<GetUserProfileRespone>();
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
  const [errorUser, setErrorUser] = useState<Error | null>(null);

  const fetchUserProfile = async () => {
    try {
      setIsLoadingUser(true);
      const response = await userService.getUserProfile(username);
      console.log("User profile response:", response);
      setUser(response);
    } catch (error) {
      setErrorUser(error as Error);
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoadingUser(false);
    }
  };
  useEffect(() => {
    if (!username) return;
    fetchUserProfile();
  }, [username]);

  return {
    user,
    isLoadingUser,
    errorUser,
    fetchUserProfile,
  };
}

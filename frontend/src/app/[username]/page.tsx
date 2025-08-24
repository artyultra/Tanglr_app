// src/app/[username]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "@/types/users";
import { usersService } from "@/services/users";
import { useParams, useRouter } from "next/navigation";
import CurrentUserPage from "./CurrentUserPage/CurrentUserPage";
import PublicPage from "./PublicProfilePage/PublicPage";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { username } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleRefreshUserData = () => {
    setIsLoading(true);
    fetchUserData();
  };

  const fetchUserData = async () => {
    try {
      const resData = await usersService.getUser(username as string);
      if (!resData?.exists) {
        router.push("/404");
      }
      setUserData(resData);
    } catch (error) {
      const errorToSet =
        error instanceof Error ? error : new Error(String(error));
      setError(errorToSet);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (status === "authenticated") {
      fetchUserData();
    }
  }, [session, status, username]);

  return (
    <>
      {!session && <p>You are not logged in.</p>}
      {error && <p>Error: {error.message}</p>}
      {isLoading && <p>Loading...</p>}
      {userData ? (
        <CurrentUserPage
          userData={userData}
          handleRefreshUserData={handleRefreshUserData}
        />
      ) : (
        <PublicPage userData={userData} />
      )}
    </>
  );
};

export default ProfilePage;

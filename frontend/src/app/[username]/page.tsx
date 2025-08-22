import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { usersService } from "@/services/users";
import styles from "./page.module.css";
import CurrentUserPage from "./CurrentUserPage/CurrentUserPage";
import PublicPage from "./PublicPage";

interface UserProfilePageProps {
  params: {
    username: string;
  };
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const session = await auth();

  if (!session?.user || !session?.accessToken) {
    redirect("/login");
  }

  let userData;
  try {
    userData = await usersService.getUser(params.username, session.accessToken);
    console.log(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    userData = null;
  }

  if (!userData || !userData.exists) {
    notFound();
  }

  const isOwnProfile = session.user.username === params.username;

  console.log(userData);

  return (
    <div className={styles.container}>
      {isOwnProfile ? (
        <CurrentUserPage userData={userData} session={session} />
      ) : (
        <PublicPage userData={userData} />
      )}
    </div>
  );
}

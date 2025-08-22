import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { usersService } from "@/services/users";
import DashboardClient from "./DashboardClient/DashboardClient";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user || !session?.accessToken) {
    redirect("/login");
  }

  let userData;
  let loading = true;
  try {
    userData = await usersService.getUser(
      session.user.username,
      session.accessToken,
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    userData = null;
  } finally {
    loading = false;
  }
  return <DashboardClient session={session} />;
}

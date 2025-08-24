import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient/DashboardClient";
import { signOut } from "next-auth/react";

export default async function HomePage() {
  const session = await auth();

  if (session?.error === "RefreshAccessTokenError") {
    await signOut();
  }

  if (!session?.user || !session?.accessToken) {
    redirect("/login");
  }

  return <DashboardClient session={session} />;
}

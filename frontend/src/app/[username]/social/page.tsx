"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { notFound, useParams, useRouter } from "next/navigation";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import BrowseUsers from "@/components/social/BrowseUsers";

export default function FriendsPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated and the username matches
    if (status === "authenticated") {
      if (session?.user?.name !== params.username) {
        // Redirect to 404 if the username doesn't match
        notFound();
      }
    } else if (status === "unauthenticated") {
      // Redirect to login if not authenticated
      router.push("/login");
    }
    // Don't redirect during loading state
  }, [session, status, params.username, router]);

  // While loading, show nothing
  if (
    status === "loading" ||
    (status === "authenticated" && session?.user?.name !== params.username)
  ) {
    return null;
  }

  return (
    <div className="max-h-[100vh] bg-gradient-to-b from-gray-600 to-gray-900 font-sans flex flex-col">
      <NavBar />

      <div className=" h-[90vh] mx-auto px-4 py-6 grid grid-cols-2 grid-rows-6 gap-4">
        <BrowseUsers />
        <div className="bg-gray-700"></div>
      </div>

      <Footer />
    </div>
  );
}

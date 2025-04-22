"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { notFound, useParams, useRouter } from "next/navigation";
import UsersPage from "@/components/UsersPage";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import SocialSidebar from "@/components/layout/Social/SocialSidebar";
import SocialSidbar from "@/components/layout/Social/SocialSidebar";

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

      <div className="max-w-6xl h-[90vh] mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow">
        <SocialSidbar />
      </div>

      <Footer />
    </div>
  );
}

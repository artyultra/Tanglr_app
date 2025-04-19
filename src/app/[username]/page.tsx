// src/app/[username]/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import LeftSidebar from "@/components/layout/LeftSidebar";
import MainContent from "@/components/layout/MainContent";
import RightSideBar from "@/components/layout/RightSideBar";
import { useUserProfileActions } from "@/hooks/useUserProfileActions";

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();

  const params = useParams();
  const username = params.username as string;
  const { user, isLoadingUser, errorUser } = useUserProfileActions(username);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="max-h-screen bg-gradient-to-b from-gray-600 to-gray-900 font-sans flex flex-col">
      {/* Top Navigation Bar - MySpace Style */}
      <NavBar />

      {/* Main Content */}
      <div className="max-w-6xl h-[10%] mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow">
        {/* Left Sidebar */}
        <LeftSidebar
          user={user}
          isLoadingUser={isLoadingUser}
          errorUser={errorUser}
        />

        {/* Main Content Area */}
        <MainContent />

        {/* Right Sidebar */}
        <RightSideBar />
      </div>

      {/* Footer with sparkly effects */}
      <Footer />
    </div>
  );
}

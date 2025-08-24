"use client";
import { Sidebar, RightSidebar, PostModal } from "@/components";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { PostProvider, usePostContext } from "@/contexts/PostContext";
import { usersService } from "@/services/users";

interface LayoutClientProps {
  children: React.ReactNode;
}

const LayoutClientInner = ({ children }: LayoutClientProps) => {
  const [showModal, setShowModal] = useState(false);
  const { data: session, update } = useSession();
  const { handlePostFetchTrigger } = usePostContext();

  useEffect(() => {
    usersService.setSessionUpdateCallback(update);
    usersService.setLogoutCallback(signOut);
  }, [update]);

  return (
    <div className="app-layout">
      <Sidebar onComposeClick={() => setShowModal(true)} />
      <main className="app-main">{children}</main>
      <RightSidebar />
      <PostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        session={session}
        handlePostFetchTrigger={handlePostFetchTrigger}
      />
    </div>
  );
};

const LayoutClient = ({ children }: LayoutClientProps) => {
  return (
    <PostProvider>
      <LayoutClientInner>{children}</LayoutClientInner>
    </PostProvider>
  );
};

export default LayoutClient;

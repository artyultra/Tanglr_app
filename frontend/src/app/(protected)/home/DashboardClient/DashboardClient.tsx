"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/users";
import { usersService } from "@/services/users";
import setColorMode from "@/services/colorMode";
import { Session } from "next-auth";
import PostInput from "../PostInput/PostInput";
import ForYou from "../ForYou/ForYou";
import Following from "../Following/Following";

import styles from "./DashboardClient.module.css";
import { STORAGE_KEYS } from "@/lib/api";

interface DashboardClientProps {
  session: Session;
}

const DashboardClient = ({ session }: DashboardClientProps) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(session.user));
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, session.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await usersService.getUser(
          session.user.username,
          session.accessToken,
        );
        setUserData(res);
        setColorMode(res?.dark_mode, document.documentElement);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className={styles.container}>
      {!isLoading && userData && (
        <>
          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tab} ${activeTab === "forYou" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("forYou")}
            >
              <span className={styles.tabText}>For You</span>
              {activeTab === "forYou" && (
                <div className={styles.tabIndicator} />
              )}
            </button>
            <button
              className={`${styles.tab} ${activeTab === "following" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("following")}
            >
              <span className={styles.tabText}>Following</span>
              {activeTab === "following" && (
                <div className={styles.tabIndicator} />
              )}
            </button>
          </div>

          <PostInput
            userData={userData}
            session={session}
            setRefreshTrigger={setRefreshTrigger}
          />

          <div className={styles.feedContainer}>
            {activeTab === "forYou" ? (
              <ForYou session={session} refreshTrigger={refreshTrigger} />
            ) : (
              <Following />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardClient;

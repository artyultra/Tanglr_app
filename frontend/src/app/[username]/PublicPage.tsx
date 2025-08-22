"use client";

import { User } from "@/types/users";
import styles from "./page.module.css";

interface PublicPageProps {
  userData: User;
}

export default function PublicPage({ userData }: PublicPageProps) {
  return (
    <div className={styles.profileWrapper}>
      <div className={styles.coverImage}></div>

      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          {userData.avatar_url ? (
            <img
              src={userData.avatar_url}
              alt={`${userData.username}'s avatar`}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatar}>
              {userData.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className={styles.profileInfo}>
          <h1 className={styles.displayName}>{userData.username}</h1>
          <p className={styles.username}>@{userData.username}</p>
          {userData.created_at && (
            <div className={styles.joinDate}>
              <span>
                Joined{" "}
                {new Date(userData.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>0</span>
              <span className={styles.statLabel}>Following</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>0</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.tabActive}`}>Posts</button>
        <button className={styles.tab}>Media</button>
        <button className={styles.tab}>Likes</button>
      </div>

      <div className={styles.content}>
        <div className={styles.emptyState}>
          <p>No posts yet</p>
        </div>
      </div>
    </div>
  );
}


"use client";

import { User } from "@/types/users";
import styles from "./CurrentUserPage.module.css";
import { useEffect, useState } from "react";
import { PostDisplay } from "@/types/posts";
import { postsService } from "@/services/posts";
import PostCard from "@/components/PostCard/PostCard";
import { Session } from "next-auth";
import { ArrowLeft, Search } from "lucide-react";

interface CurrentUserPageProps {
  userData: User;
  session: Session;
}

const CurrentUserPage = ({ userData, session }: CurrentUserPageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<PostDisplay[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await postsService.getPostsByUsername(
          session?.user?.username,
          session?.accessToken,
        );
        setPosts(postsData || []);
      } catch (error) {
        const errorToSet =
          error instanceof Error ? error : new Error(String(error));
        setError(errorToSet);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [session]);

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.banner}>
        <ArrowLeft />
        <div className={styles.bannerHeader}>
          <h1 className={styles.bannerTitle}>{userData.username}</h1>
          <p
            className={styles.bannerSubtext}
          >{`${posts?.length} ${posts?.length > 1 ? "posts" : "post"}`}</p>
        </div>
        <button className={styles.searchButton}>
          <Search />
        </button>
      </div>
      <div className={styles.coverImage}>
        <img src="https://68rdbf2n6t.ufs.sh/f/eFaWLjkdXdtlUWBy5FXcWR3rVUzBTD2ukjxYylC9Gm7iqA4o" />
      </div>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          {userData.avatar_url && (
            <img
              src={userData.avatar_url}
              alt={`${userData.username}'s avatar`}
              className={styles.avatar}
            />
          )}
          <button className={styles.editButton}>Edit Profile</button>
        </div>

        <div className={styles.profileInfo}>
          <h1 className={styles.displayName}>{userData.username}</h1>
          <p className={styles.username}>@{userData.username}</p>
          {userData.email && <p className={styles.bio}>{userData.email}</p>}
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
        {isLoading ? (
          <div className={styles.loading}>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>Error: {error.message}</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post, index) => <PostCard key={index} post={post} />)
        ) : (
          <div className={styles.emptyState}>
            <p>No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentUserPage;

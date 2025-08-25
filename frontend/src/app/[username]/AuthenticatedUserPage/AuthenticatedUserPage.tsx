// src/app/[username]/AuthenticatedUserPage/AuthenticatedUserPage.tsx
"use client";

import { UploadThingResponse, User } from "@/types/users";
import styles from "./AuthenticatedUserPage.module.css";
import { useEffect, useState } from "react";
import { PostDisplay } from "@/types/posts";
import { postsService } from "@/services/posts";
import PostCard from "@/components/PostCard/PostCard";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { usePostContext } from "@/contexts/PostContext";
import { UploadButton } from "@/services/uploadThing";
import { usersService } from "@/services/users";
import { useSession } from "next-auth/react";

interface AuthenticatedUserPageProps {
  userData: User;
  handleRefreshUserData: () => void;
}

const AuthenticatedUserPage = ({
  userData,
  handleRefreshUserData,
}: AuthenticatedUserPageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<PostDisplay[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const { postFetchTrigger } = usePostContext();
  const { data: session } = useSession();

  const handleBackButton = () => {
    window.history.back();
  };

  const handleUpdateAvatar = async (res: UploadThingResponse[]) => {
    try {
      console.log("uploadAvatar Response: \n", res);
      const avatarUrl = res[0].url;
      await usersService.putAvatar(avatarUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
      handleRefreshUserData();
    }
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await postsService.getPostsByUsername(
          session?.user?.username,
          session?.accessToken,
        );
        postsData === null ? setPosts([]) : setPosts(postsData);
      } catch (error) {
        const errorToSet =
          error instanceof Error ? error : new Error("Error fetching posts");
        setError(errorToSet);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [session, postFetchTrigger]);

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.banner}>
        <button className={styles.backButton} onClick={handleBackButton}>
          <ArrowLeft />
        </button>
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
        <img
          src="https://68rdbf2n6t.ufs.sh/f/eFaWLjkdXdtlUWBy5FXcWR3rVUzBTD2ukjxYylC9Gm7iqA4o"
          alt="Profile Cover Image"
        />
      </div>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            {/* Avatar image */}
            <img
              src={userData.avatar_url}
              alt={`${userData.username}'s avatar`}
              className={styles.avatar}
            />

            {/* Upload overlay - only shown when editing */}
            {isEditing && (
              <UploadButton
                endpoint="avatarUpload"
                onClientUploadComplete={(res) => handleUpdateAvatar(res)}
                onUploadError={(err) => console.log(err)}
                className={styles.uploadOverlay} // Custom class for positioning
                appearance={{
                  container: {
                    width: "fit-content",
                    height: "fit-content",
                    padding: "0",
                  },
                  button: {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "fit-content",
                    height: "fit-content",
                    background: "transparent",
                    border: "none",
                    padding: "0",
                    margin: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  },
                  allowedContent: {
                    display: "none",
                  },
                }}
                content={{
                  button: (
                    <span className={styles.changeText}>
                      <Plus />
                    </span>
                  ),
                }}
              />
            )}
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={styles.editButton}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
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
              <span className={styles.statNumber}>
                {session?.user?.following}
              </span>
              <span className={styles.statLabel}>Following</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {session?.user?.followers}
              </span>
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

export default AuthenticatedUserPage;

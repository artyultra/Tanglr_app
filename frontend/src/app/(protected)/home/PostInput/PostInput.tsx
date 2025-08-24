"use client";

import { useEffect, useState } from "react";
import { postsService } from "@/services/posts";
import { User } from "@/types/users";
import { Image, FileImage, Smile, BarChart3 } from "lucide-react";
import styles from "./PostInput.module.css";
import { Session } from "next-auth";

interface PostInputProps {
  userData: User;
  session: Session;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

const PostInput = ({
  userData,
  session,
  setRefreshTrigger,
}: PostInputProps) => {
  const [postText, setPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!postText.trim() || isPosting) return;

    setIsPosting(true);
    try {
      await postsService.createPost({ body: postText }, session?.accessToken);
      setPostText("");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsPosting(false);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  return (
    <div className={styles.composeSection}>
      <div className={styles.composeContainer}>
        <div className={styles.composeAvatar}>
          <img src={userData?.avatar_url} alt="Avatar" />
        </div>
        <div className={styles.composeContent}>
          <textarea
            className={styles.composeInput}
            placeholder="What's happening?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={1}
          />
          <div className={styles.composeActions}>
            <div className={styles.composeTools}>
              <button className={styles.toolButton} aria-label="Add image">
                <Image size={20} />
              </button>
              <button className={styles.toolButton} aria-label="Add GIF">
                <FileImage size={20} />
              </button>
              <button className={styles.toolButton} aria-label="Add emoji">
                <Smile size={20} />
              </button>
              <button className={styles.toolButton} aria-label="Add poll">
                <BarChart3 size={20} />
              </button>
            </div>
            <button
              className={styles.postButton}
              onClick={handlePost}
              disabled={!postText.trim() || isPosting}
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostInput;

"use client";

import { useEffect, useState } from "react";
import styles from "./CreatePostForm.module.css";
import { postsService } from "@/services/posts";
import { Session } from "next-auth";
import {
  Image,
  ImagePlay,
  ListTodo,
  SendHorizonalIcon,
  Video,
  X,
} from "lucide-react";
import { UploadButton } from "@/services/uploadThing";
import { UploadThingResponse } from "@/types/users";

interface CreatePostFromProps {
  session: Session | null;
  onClose: () => void;
  handlePostFetchTrigger: () => void;
}

interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  darkMode: boolean;
}

const CreatePostForm = ({
  session,
  onClose,
  handlePostFetchTrigger,
}: CreatePostFromProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [postText, setPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!postText.trim() || isPosting) return;
    setIsPosting(true);
    try {
      await postsService.createPost({ body: postText }, session?.accessToken);
      setPostText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
      onClose();
      handlePostFetchTrigger();
    }
  };

  const handleAvatarUpload = async (res: UploadThingResponse) => {
    // try {} catch (error) finally {}
    console.log(res);
  };

  useEffect(() => {
    if (!session) return;
    setUserInfo({
      ...userInfo,
      id: session?.user?.id,
      username: session?.user?.username,
      email: session?.user?.email,
      avatarUrl: session?.user?.avatarUrl,
      darkMode: session?.user?.darkMode,
    });
  }, [session]);

  return (
    <div className={styles.postFormContainer}>
      <div className={styles.banner}>
        <X onClick={onClose} />
        <button
          className={styles.draftsBtn}
          type="button"
          onClick={() => console.log("drafts button")}
        >
          <span>Drafts</span>
        </button>
      </div>
      <div className={styles.postInputContainer}>
        <img src={userInfo?.avatarUrl} alt="user avatar" />
        <textarea
          placeholder="What's on your mind?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
      </div>
      <div className={styles.divider} />
      <div className={styles.postActions}>
        <div className={styles.postActionBtns}>
          <UploadButton
            endpoint="avatarUpload"
            onClientUploadComplete={handleAvatarUpload}
            onUploadError={(err) => console.error(err)}
            appearance={{
              button: {
                background: "transparent",
                border: "none",
                color: "transparent",
                width: "fit-content",
                height: "fit-content",
              },
              allowedContent: {
                display: "none",
              },
            }}
            content={{
              button: <Image />,
            }}
          />
          <ImagePlay />
          <Video />
          <ListTodo />
        </div>
        <button type="submit" onClick={handlePost}>
          {isPosting ? (
            <span className={styles.postingSpan}>Posting...</span>
          ) : (
            <SendHorizonalIcon />
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePostForm;

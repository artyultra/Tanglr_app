// components/PostModal/PostModal.tsx
"use client";
import styles from "./PostModal.module.css";
import { X } from "lucide-react";
import CreatePostFrom from "../CreatePostForm/CreatePostForm";
import { Session } from "next-auth";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  handlePostFetchTrigger: () => void;
}

export default function PostModal({
  isOpen,
  onClose,
  session,
  handlePostFetchTrigger,
}: PostModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <CreatePostFrom
          session={session}
          onClose={onClose}
          handlePostFetchTrigger={handlePostFetchTrigger}
        />
      </div>
    </div>
  );
}

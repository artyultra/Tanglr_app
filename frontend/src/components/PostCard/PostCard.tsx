import { PostDisplay } from "@/types/posts";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  MoreHorizontal,
} from "lucide-react";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: PostDisplay;
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  const currentYear = now.getFullYear();

  if (year === currentYear) {
    return `${month} ${day}`;
  }
  return `${month} ${day}, ${year}`;
};

const PostCard = ({ post }: PostCardProps) => {
  console.log(post);
  return (
    <article className={styles.postCard}>
      <div className={styles.avatarContainer}>
        <img
          className={styles.avatar}
          src={post.avatar_url || "/default-avatar.png"}
          alt={`${post.username} avatar`}
        />
      </div>
      <div className={styles.postContent}>
        <div className={styles.postHeader}>
          <span className={styles.displayName}>{post.username}</span>
          <span className={styles.username}>@{post.username}</span>
          <span className={styles.separator}>·</span>
          <time className={styles.timestamp}>
            {formatTimeAgo(post.created_at)}
          </time>
          <button className={styles.moreButton} aria-label="More options">
            <MoreHorizontal className={styles.moreIcon} />
          </button>
        </div>
        <div className={styles.postText}>{post.body}</div>
        <div className={styles.postActions}>
          <button className={styles.actionButton} aria-label="Reply">
            <MessageCircle className={styles.actionIcon} />
            <span className={styles.actionCount}>0</span>
          </button>
          <button className={styles.actionButton} aria-label="Retweet">
            <Repeat2 className={styles.actionIcon} />
            <span className={styles.actionCount}>0</span>
          </button>
          <button className={styles.actionButton} aria-label="Like">
            <Heart className={styles.actionIcon} />
            <span className={styles.actionCount}>0</span>
          </button>
          <button className={styles.actionButton} aria-label="Share">
            <Share className={styles.actionIcon} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;

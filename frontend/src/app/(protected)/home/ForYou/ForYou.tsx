"use client";

import styles from "./ForYou.module.css";
import { PostDisplay } from "@/types/posts";
import PostCard from "@/components/PostCard/PostCard";
interface ForYouProps {
  posts: PostDisplay[];
}

const ForYou = ({ posts }: ForYouProps) => {
  return (
    <div className={styles.feed}>
      {posts.length === 0 ? (
        <div className={styles.emptyFeed}>
          <h3>No posts found</h3>
          <p>Start posting to see your feed here.</p>
        </div>
      ) : (
        posts.map((post) => <PostCard post={post} key={post.id} />)
      )}
    </div>
  );
};

export default ForYou;

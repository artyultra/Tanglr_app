"use client";

import { useEffect, useState } from "react";
import styles from "./ForYou.module.css";
import { PostDisplay } from "@/types/posts";
import { postsService } from "@/services/posts";
import { Session } from "next-auth";
import PostCard from "@/components/PostCard/PostCard";

interface ForYouProps {
  session: Session;
  refreshTrigger: number;
}

const ForYou = ({ session, refreshTrigger }: ForYouProps) => {
  const [posts, setPosts] = useState<PostDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await postsService.getPosts(session?.accessToken);
        setPosts(res);
      } catch (error) {
        const errorToSet =
          error instanceof Error ? error : new Error(String(error));
        setError(errorToSet);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [refreshTrigger]);

  return (
    <div className={styles.feed}>
      {error && <div className={styles.error}>{error.message}</div>}
      {loading && <div className={styles.loading}>Loading...</div>}
      {!loading && posts.length === 0 ? (
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

import { useEffect, useState } from "react";
import { userService } from "@/app/api";
import { GetPostsResponse } from "@/app/api/types";

export function useUserPostActions(username: string) {
  const [postText, setPostText] = useState<string>("");
  const [charCountPost, setCharCountPost] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handlePostTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPostText(text);
    setCharCountPost(text.length);
  };

  const handleSubmitPost = async () => {
    if (postText.trim() && !isSubmitting) {
      try {
        setIsSubmitting(true);
        await userService.createPost({ body: postText });
        setPostText("");
        setCharCountPost(0);
        await fetchPosts();
      } catch (error) {
        console.error("Error creating post:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const [posts, setPosts] = useState<GetPostsResponse>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getPosts(username);
      console.log("Posts response:", response);
      setPosts(response);
    } catch (error) {
      setError(error as Error);
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    postText,
    setPostText,
    charCountPost,
    isSubmitting,
    handlePostTextChange,
    handleSubmitPost,
    posts,
    isLoading,
    error,
    fetchPosts,
  };
}

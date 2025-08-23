"use client";

import { createContext, useContext, useState } from "react";

interface PostContextProps {
  postFetchTrigger: number;
  handlePostFetchTrigger: () => void;
}

const PostContext = createContext<PostContextProps | undefined>(undefined);

const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [postFetchTrigger, setPostFetchTrigger] = useState(0);

  const handlePostFetchTrigger = () => {
    setPostFetchTrigger((prev) => prev + 1);
  };

  return (
    <PostContext.Provider value={{ postFetchTrigger, handlePostFetchTrigger }}>
      {children}
    </PostContext.Provider>
  );
};

// hook
const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};

export { usePostContext, PostProvider };

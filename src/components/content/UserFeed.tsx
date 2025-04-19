// File: components/content/UserFeed.tsx

import { useUserPostActions } from "@/hooks/userPostActions";
import PostForm from "./PostForm";
import UserPosts from "./UserPosts";
import { useParams } from "next/navigation";

const UserFeed: React.FC = () => {
  const params = useParams();
  const username = params.username as string;
  const postAct = useUserPostActions(username);
  return (
    <div className="bg-gray-800 rounded-3xl p-4 mb-4 flex flex-col">
      <PostForm
        postText={postAct.postText}
        charCountPost={postAct.charCountPost}
        isSubmitting={postAct.isSubmitting}
        handlePostTextChange={postAct.handlePostTextChange}
        handleSubmitPost={postAct.handleSubmitPost}
      />
      <UserPosts
        posts={postAct.posts}
        isLoading={postAct.isLoading}
        error={postAct.error}
        fetchPosts={postAct.fetchPosts}
      />
    </div>
  );
};

export default UserFeed;

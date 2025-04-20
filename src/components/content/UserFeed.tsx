// File: components/content/UserFeed.tsx

import { useUserPostActions } from "@/hooks/userPostActions";
import PostForm from "./PostForm";
import UserPosts from "./UserPosts";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";

const UserFeed: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const params = useParams();
  const username = params.username as string;
  const postAct = useUserPostActions(username);

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = () => {
    postAct.handleSubmitPost();
    setShowForm(false);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  return (
    <div className="bg-gray-800 rounded-3xl p-4 mb-4 flex flex-col">
      {showForm && (
        <PostForm
          postText={postAct.postText}
          charCountPost={postAct.charCountPost}
          isSubmitting={postAct.isSubmitting}
          handlePostTextChange={postAct.handlePostTextChange}
          handleSubmitPost={handleSubmit}
          handleCancel={handleCancel}
        />
      )}
      <UserPosts
        posts={postAct.posts}
        isLoading={postAct.isLoading}
        error={postAct.error}
        fetchPosts={postAct.fetchPosts}
        handleShowForm={handleShowForm}
      />
    </div>
  );
};

export default UserFeed;

// File: components/layout/LeftSidebar.tsx

import FriendSpace from "../profile/FriendSpace";
import MusicPlayer from "../profile/MusicPlayer";
import ProfileCard from "../profile/ProfileCard";
import { GetUserProfileRespone } from "@/app/api/types";

interface Props {
  user?: GetUserProfileRespone;
  isLoadingUser: boolean;
  errorUser: Error | null;
}

const LeftSidebar: React.FC<Props> = ({ user, isLoadingUser, errorUser }) => {
  return (
    <div className="md:col-span-4">
      <ProfileCard
        user={user}
        isLoadingUser={isLoadingUser}
        errorUser={errorUser}
      />

      {/* Comments Section */}
      <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
        <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
          Comments (0)
        </h3>
        <div className="text-center italic text-sm text-gray-500">
          No comments yet. Be the first to leave a comment!
        </div>
        <div className="mt-4">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            placeholder="Leave a comment..."
            rows={3}
          ></textarea>
          <button className="bg-button hover:bg-button-hover text-gray-100 font-bold py-1 px-3 mt-2 text-sm rounded">
            Post Comment
          </button>
        </div>
      </div>

      {/* Friend Space */}
      <FriendSpace />

      {/* Music Player */}
      <MusicPlayer />
    </div>
  );
};

export default LeftSidebar;

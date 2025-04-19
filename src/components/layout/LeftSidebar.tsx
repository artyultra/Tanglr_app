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
    <div className="md:col-span-3">
      <ProfileCard
        user={user}
        isLoadingUser={isLoadingUser}
        errorUser={errorUser}
      />
      <FriendSpace />
      <MusicPlayer />
    </div>
  );
};

export default LeftSidebar;

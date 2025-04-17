// File: components/layout/LeftSidebar.tsx

import FriendSpace from "../profile/FriendSpace";
import MusicPlayer from "../profile/MusicPlayer";
import ProfileCard from "../profile/ProfileCard";

const LeftSidebar: React.FC = () => {
  return (
    <div className="md:col-span-3">
      <ProfileCard />
      <FriendSpace />
      <MusicPlayer />
    </div>
  );
};

export default LeftSidebar;

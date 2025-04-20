// File: components/layout/MainContent.tsx

import AboutMe from "../content/AboutMe";
import UserFeed from "../content/UserFeed";

const MainContent: React.FC = () => {
  return (
    <div className="md:col-span-8  flex flex-col h-full">
      <AboutMe />
      <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4 grid grid-cols-2">
        {/* Interests */}
        <div className="bg-gray-800 rounded-4xl p-4 m-2">
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
            Interests
          </h3>
          <ul className="text-sm list-disc pl-5">
            <li>Music</li>
            <li>Movies</li>
            <li>Technology</li>
            <li>Social Media</li>
          </ul>
        </div>

        {/* Stats */}
        <div className="bg-gray-800 rounded-4xl p-4 m-2">
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
            Stats
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Profile Views:</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Friends:</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Comments:</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Member Since:</span>
              <span className="font-bold">Today</span>
            </div>
          </div>
        </div>
      </div>
      <UserFeed />
    </div>
  );
};

export default MainContent;

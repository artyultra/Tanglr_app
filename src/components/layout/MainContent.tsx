// File: components/layout/MainContent.tsx

import AboutMe from "../content/AboutMe";
import UserFeed from "../content/UserFeed";

const MainContent: React.FC = () => {
  return (
    <div className="md:col-span-6 flex flex-col h-full">
      <AboutMe />
      <UserFeed />
    </div>
  );
};

export default MainContent;

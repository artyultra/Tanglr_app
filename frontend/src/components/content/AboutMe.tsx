// File: components/content/AboutMe.tsx
"use client";

import { useSession } from "next-auth/react";

const AboutMe: React.FC = () => {
  const { data: session } = useSession();
  return (
    <div className="bg-gray-800 border-2 border-gray-400 rounded-3xl p-4 mb-4 ">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {session?.user?.name}'s Space
      </h1>

      <div className="bg-gray-400 border border-gray-300 p-3 mb-4 rounded">
        <h3 className="font-bold text-gray-100">About Me:</h3>
        <p className="text-sm text-gray-100">
          This is your personal space. Tell the world about yourself!
        </p>
      </div>
    </div>
  );
};

export default AboutMe;

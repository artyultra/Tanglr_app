// File: components/profile/ProfileCard.tsx
"use client";

import { useSession } from "next-auth/react";

const ProfileCard: React.FC = () => {
  const { data: session } = useSession();
  return (
    <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
      <div className="text-center mb-3">
        <div className="w-32 h-32 bg-gray-300 mx-auto mb-2 border-2 border-gray-500">
          <img
            src="/kiganoakuma.png"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold">{session?.user?.name || "User"}</h2>
        <p className="text-xs text-gray-600">Online Now!</p>
      </div>

      <div className="border-t border-gray-300 pt-2 mb-2">
        <div className="flex justify-between text-sm">
          <span className="font-bold">Gender:</span>
          <span>Not specified</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-bold">Location:</span>
          <span>Internet</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-bold">Last Login:</span>
          <span>Today</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs mt-2">
          <div className="font-bold mb-1 text-center">Mood:</div>
          <div className="italic text-center">feeling nostalgic</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [charCountPost, setCharCountPost] = useState<number>(0);
  const handleeventPostTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCharCountPost(e.target.value.length);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-600 to-gray-900 font-sans flex flex-col">
      {/* Top Navigation Bar - MySpace Style */}
      <nav className="bg-gray-900 text-white shadow px-0 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex  items-center">
            <span className="text-2xl font-bold text-white mr-6">
              <span className="text-gray-100">Bee</span>
              <span className="text-gray-700">hive</span>
            </span>
            <div className="space-x-4 flex">
              <a href="#" className="text-white hover:text-blue-300">
                Home
              </a>
              <a href="#" className="text-white hover:text-blue-300">
                Browse
              </a>
              <a href="#" className="text-white hover:text-blue-300">
                Search
              </a>
              <a href="#" className="text-white hover:text-blue-300">
                Mail
              </a>
              <a href="#" className="text-white hover:text-blue-300">
                Blog
              </a>
            </div>
          </div>
          <div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-button hover:bg-button-hover text-gray-100 hover:text-gray-400 font-bold py-1 px-7 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow">
        {/* Left Sidebar */}
        <div className="md:col-span-3">
          <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
            <div className="text-center mb-3">
              <div className="w-32 h-32 bg-gray-300 mx-auto mb-2 border-2 border-gray-500">
                <img
                  src="/kiganoakuma.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold">
                {session?.user?.name || "User"}
              </h2>
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

          {/* Friends Section */}
          <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
            <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
              Friend Space (0)
            </h3>
            <div className="text-center italic text-sm text-gray-500">
              You have no friends yet!
            </div>
          </div>

          {/* Music Player */}
          <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
            <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
              My Music
            </h3>
            <div className="bg-black text-gray-100 p-2 rounded-lg text-xs">
              <div className="flex justify-between items-center mb-1"></div>
              <div className="w-full aspect-video mb-2">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/4G6QDNC4jPs"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-6 flex flex-col h-full">
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
          <div className="bg-gray-800 border-2 border-gray-400 rounded-3xl p-4 mb-4 flex-grow">
            <h3 className="text-xl font-bold pl-3 mb-2">My Feed:</h3>
            <div className="bg-gray-700 text-gray-100 p-3 rounded-lg">
              <textarea
                id="post"
                maxLength={140}
                className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 border-none resize-none focus:outline-none text-sm"
                placeholder="Create new post..."
                onChange={handleeventPostTextChange}
              ></textarea>
              <div className="flex justify-between items-center mt-2 text-xs">
                <div className="text-gray-400">
                  <span id="charCount">{charCountPost}</span>/140
                </div>
                <button className="bg-button hover:bg-button-hover text-gray-100 font-bold py-1 px-3 rounded">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-3">
          {/* Interests */}
          <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
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
          <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
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

          {/* Comments Section */}
          <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4">
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
        </div>
      </div>

      {/* Footer with sparkly effects */}
      <footer className="bg-black text- text-center py-4 text-xs">
        <div className="max-w-6xl mx-auto">
          <p className="mb-1">
            &copy; 2025 Beehive - A MySpace-inspired Social Network
          </p>
          <p>All rights reserved | Made with ❤️ and nostalgia</p>
        </div>
      </footer>
    </div>
  );
}

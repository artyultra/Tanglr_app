// File: components/content/UserPosts.tsx

"use client";

import { PostTypes } from "@/services";
import {
  Heart,
  MessageCircle,
  Pencil,
  RefreshCw,
  ShareIcon,
} from "lucide-react";

type UserPostsProps = {
  posts: PostTypes.GetPostsResponse;
  isLoading: boolean;
  error: Error | null;
  fetchPosts: () => void;
  handleShowForm: () => void;
};

function timeAgo(created_at: string) {
  const now = new Date();
  const then = new Date(created_at);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""}`;
  const years = Math.floor(days / 365);
  return `${years} yr${years > 1 ? "s" : ""}`;
}

const UserPosts: React.FC<UserPostsProps> = ({
  posts,
  isLoading,
  error,
  fetchPosts,
  handleShowForm,
}) => {
  console.log(posts);
  if (isLoading)
    return (
      <div className="overflow-hidden rounded-lg bg-gray-50">
        <div className="px-4 py-5 sm:p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="overflow-hidden rounded-lg bg-gray-50">
        <div className="px-4 py-5 sm:p-6 text-red-600">
          <p>Error: {error.message}</p>
        </div>
      </div>
    );

  return (
    <div className=" max-h-[50vh] overflow-y-auto rounded-lg bg-gray-50">
      {/* Header and content container */}
      <div className="px-4 py-5 sm:p-6">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleShowForm}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <Pencil size={20} />
          </button>
          <h2 className="text-lg font-medium text-gray-900">Recent Posts</h2>
          <button
            onClick={() => fetchPosts()}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Post List */}
        <div className="overflow-scroll max-h-[50vh] space-y-4">
          {!posts || posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No posts found</p>
              <p className="mt-2 text-sm">Be the first to share something!</p>
            </div>
          ) : (
            [...posts]
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              )
              .map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-md p-4 hover:shadow-sm transition duration-150"
                >
                  <div className="flex space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {post.username ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={post.user_avatar_url}
                          alt={`${post.username || post.username}'s avatar`}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm font-medium">
                            {post.username}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      {/* User info and timestamp */}
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {post.username}
                        </p>
                        <span className="mx-1 text-gray-400">·</span>
                        <p className="text-sm text-gray-500">
                          {timeAgo(post.created_at)}
                        </p>
                      </div>

                      {/* Post body */}
                      <p className="mt-1 text-sm text-gray-800 whitespace-pre-line">
                        {post.body}
                      </p>

                      {/* Action buttons */}
                      <div className="mt-3 flex space-x-6">
                        <button className="flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs">{0}</span>
                        </button>
                        <button className="flex items-center text-gray-400 hover:text-pink-500 transition-colors">
                          <Heart className="w-4 h-4 mr-1" />
                          <span className="text-xs">{0}</span>
                        </button>
                        <button className="flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                          <ShareIcon className="w-4 h-4 mr-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};
export default UserPosts;

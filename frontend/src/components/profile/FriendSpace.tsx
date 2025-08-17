// File: components/profile/FriendSpace.tsx
import { useFriendList } from "@/hooks/useFriendList";
import { useParams } from "next/navigation";
import Link from "next/link";

const FriendSpace: React.FC = () => {
  const params = useParams();
  const username = params.username as string;
  const { friendList, isLoadingFriendList, errorFriendList } =
    useFriendList(username);

  if (isLoadingFriendList) {
    return (
      <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
        <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
          Friends
        </h3>
        <div className="text-center py-4">
          <div className="animate-pulse text-gray-500">Loading friends...</div>
        </div>
      </div>
    );
  }

  if (errorFriendList) {
    return (
      <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
        <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
          Friends
        </h3>
        <div className="text-center py-4 text-red-400">
          Error: {errorFriendList.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
      <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
        Friends ({friendList?.length || 0})
      </h3>

      {!friendList || friendList.length === 0 ? (
        <div className="text-center italic text-sm text-gray-500 py-4">
          No friends yet. Add some friends to see them here!
          <p className="mt-2">Share the site with your friends!</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-700">
          {friendList.map((friend) => (
            <li key={friend.friend_username} className="py-2">
              <div className="ml-4 flex gap-3  p-2 rounded transition-colors">
                <img
                  src={friend.friend_avatar_url}
                  alt={`${friend.friend_username}'s avatar`}
                  className="size-10 rounded-full border border-gray-600 mr-2"
                />
                <div>
                  <Link
                    href={`/${friend.friend_username}`}
                    className="text-lg font-medium text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {`@${friend.friend_username}`}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 text-center">
        <Link
          href={`/${username}/friends`}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all friends →
        </Link>
      </div>
    </div>
  );
};

export default FriendSpace;

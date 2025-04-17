// File: components/profile/FriendSpace.tsx
const FriendSpace: React.FC = () => {
  return (
    <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
      <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
        Friend Space (0)
      </h3>
      <div className="text-center italic text-sm text-gray-500">
        You have no friends yet!
      </div>
    </div>
  );
};

export default FriendSpace;

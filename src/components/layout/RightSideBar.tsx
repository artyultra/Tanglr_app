// File: components/layout/RightSideBar.tsx

const RightSideBar: React.FC = () => {
  return (
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
  );
};

export default RightSideBar;

// File: components/content/PostForm.tsx

"use client";

type PostFormProps = {
  postText: string;
  charCountPost: number;
  isSubmitting: boolean;
  handlePostTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmitPost: () => void;

}

const PostForm: React.FC<PostFormProps> = ({postText, charCountPost, isSubmitting, handlePostTextChange,handleSubmitPost}) => {

  return (
    <div className="bg-gray-800 border-2 border-gray-400 rounded-3xl p-4 mb-4 flex-grow">
      <h3 className="text-xl font-bold pl-3 mb-2">My Feed:</h3>
      <div className="bg-gray-700 text-gray-100 p-3 rounded-lg">
        <textarea
          id="post"
          maxLength={140}
          value={postText}
          onChange={handlePostTextChange}
          className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 border-none resize-none focus:outline-none text-sm"
          placeholder="Create new post..."
        ></textarea>
        <div className="flex justify-between items-center mt-2 text-xs">
          <div className="text-gray-400">
            <span id="charCount">{charCountPost}</span>/140
          </div>
          <button
            onClick={handleSubmitPost}
            disabled={isSubmitting}
            className="bg-button hover:bg-button-hover text-gray-100 font-bold py-1 px-3 rounded"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
});

export default PostForm;

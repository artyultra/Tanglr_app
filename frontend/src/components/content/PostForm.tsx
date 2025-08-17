// File: components/content/PostForm.tsx

"use client";

import styles from "./PostForm.module.css"


type PostFormProps = {
  postText: string;
  charCountPost: number;
  isSubmitting: boolean;
  handlePostTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmitPost: () => void;
  handleCancel: () => void;

}

const PostForm: React.FC<PostFormProps> = ({
  postText,
  charCountPost,
  isSubmitting, 
  handlePostTextChange, 
  handleSubmitPost, 
  handleCancel}) => {

  return (
    <div className={`${styles.postForm} bg-gray-800 rounded-3xl mb-4`}>
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
          <div>
          <button
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-400 text-gray-600 font-bold py-1 px-3 rounded mr-2"
          >
            Cancel
          </button>
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
    </div>
  );
});

export default PostForm;

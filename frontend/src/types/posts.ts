export interface Post {
  id: string;
  body: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  username: string;
}

export interface PostDisplay {
  id: string;
  body: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  username: string;
  avatar_url: string;
}

export interface CreatePostRequest {
  body: string;
}

export interface CreatePostResponse extends Post {}

export type GetPostsResponse = PostDisplay[];


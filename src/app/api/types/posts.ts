// src/app/api/types/posts.ts
export interface CreatePostRequest {
  body: string;
}

export interface CreatePostResponse {
  Body: string;
}

export interface Post {
  id: string;
  body: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  username: string;
}

export type GetPostsResponse = Post[];

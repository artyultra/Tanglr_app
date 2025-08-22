import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.string().min(1, 'Post body is required').max(5000, 'Post body must be less than 5000 characters'),
});

export const postSchema = z.object({
  id: z.string().uuid(),
  body: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string().uuid(),
  username: z.string(),
});

export const postDisplaySchema = postSchema.extend({
  user_avatar_url: z.string(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type PostValidated = z.infer<typeof postSchema>;
export type PostDisplayValidated = z.infer<typeof postDisplaySchema>;
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  avatar_url: z.string().url().optional(),
  exists: z.boolean(),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const createUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const friendsSchema = z.object({
  user_id: z.string().uuid(),
  friend_id: z.string().uuid(),
  status: z.string(),
  initiator_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const friendUserSchema = friendsSchema.extend({
  friend_username: z.string(),
  friend_avatar_url: z.string(),
});

export type UserValidated = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type FriendsValidated = z.infer<typeof friendsSchema>;
export type FriendUserValidated = z.infer<typeof friendUserSchema>;
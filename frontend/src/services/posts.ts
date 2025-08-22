import { httpClient, ENDPOINTS } from "@/lib/api";
import { createPostSchema, type CreatePostInput } from "@/lib/validators/posts";
import type {
  CreatePostRequest,
  CreatePostResponse,
  GetPostsResponse,
} from "@/types/posts";

export class PostsService {
  async createPost(
    data: CreatePostInput,
    accessToken?: string,
  ): Promise<CreatePostResponse> {
    const validatedData = createPostSchema.parse(data);

    const options = accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined;

    const requestData: CreatePostRequest = {
      body: validatedData.body,
    };

    return httpClient.post<CreatePostResponse>(
      ENDPOINTS.POSTS.CREATE,
      requestData,
      options,
    );
  }

  async getPostsByUsername(
    username: string | undefined,
    accessToken: string | undefined,
  ): Promise<GetPostsResponse> {
    const options = accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined;

    return httpClient.get<GetPostsResponse>(
      ENDPOINTS.POSTS.GET_BY_USERNAME(username),
      options,
    );
  }

  async getPosts(accessToken: string | undefined): Promise<GetPostsResponse> {
    const options = accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined;

    return httpClient.get<GetPostsResponse>(ENDPOINTS.POSTS.GET_ALL, options);
  }
}

export const postsService = new PostsService();

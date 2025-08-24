export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    REFRESH_TOKEN: "/refresh-token",
    REVOKE_TOKEN: "/refresh-token",
  },
  USERS: {
    CREATE: "/users",
    GET: (username: string) => `/users/${username}`,
    PUT_AVATAR: "/users/me/avatar",
  },
  POSTS: {
    CREATE: "/posts",
    GET_BY_USERNAME: (username: string | undefined) => `/posts/${username}`,
    GET_ALL: "/posts",
  },
  ADMIN: {
    RESET: "/reset",
  },
} as const;

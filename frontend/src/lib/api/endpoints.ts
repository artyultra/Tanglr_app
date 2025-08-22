export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    REFRESH_TOKEN: "/refresh-token",
    REVOKE_TOKEN: "/refresh-token",
  },
  USERS: {
    CREATE: "/users",
    GET: (username: string) => `/users/${username}`,
    GET_NON_FRIENDS: (username: string) => `/users/${username}/friends`,
    GET_FRIENDS_LIST: (username: string) => `/users/${username}/friendslist`,
    ADD_FRIEND: (username: string, friendUsername: string) =>
      `/users/${username}/friends/${friendUsername}`,
  },
  POSTS: {
    CREATE: "/posts",
    GET_BY_USERNAME: (username: string) => `/posts/${username}`,
    GET_ALL: "/posts",
  },
  ADMIN: {
    RESET: "/reset",
  },
} as const;

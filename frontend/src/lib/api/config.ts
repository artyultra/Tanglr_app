export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
export const API_VERSION = "v1";
export const API_URL = `${API_BASE_URL}/${API_VERSION}`;

export const API_TIMEOUT = 30000;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;


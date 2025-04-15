// src/lib/api.ts
import axios from "axios";
import { getSession } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.user?.accessToken) {
        config.headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add user-related API functions
export const userApi = {
  login(username, password) {
    return api
      .post("/login", { username, password })
      .then((response) => response.data);
  },

  register(username, email, password) {
    return api
      .post("/users", { username, email, password })
      .then((response) => response.data);
  },

  // Add more user-related API functions as needed
};

export default api;

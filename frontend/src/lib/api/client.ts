import { getSession } from "next-auth/react";

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "http://localhost:8082";
  }

  private async getHeaders(): Promise<HeadersInit> {
    const session = await getSession();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (session?.accessToken) {
      headers["Authorization"] = `Bearer ${session.accessToken}`;
    }

    return headers;
  }

  async get(endpoint: string) {
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  }

  async post(endpoint: string, data: unknown) {
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  }

  async put(endpoint: string, data: unknown) {
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  }
  async delete(endpoint: string) {
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  }
}

export const apiClient = new APIClient();

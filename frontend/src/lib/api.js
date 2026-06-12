/**
 * API Client Configuration
 * Axios instance with base URL and interceptors.
 */

import axios from "axios";

const getApiUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-x9s4.onrender.com";
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[API]", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("[API] No response received:", error.message);
    } else {
      console.error("[API] Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch suggested prompts from the backend.
 */
export async function fetchSuggestions() {
  const response = await api.get("/api/chat/suggestions");
  return response.data.suggestions;
}

/**
 * Check backend health.
 */
export async function checkHealth() {
  const response = await api.get("/api/chat/health");
  return response.data;
}

export default api;

// frontend/src/apiClient.js
import axios from "axios";

// ✅ Base URL from environment (Render / Vercel) or fallback to localhost
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach JWT token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;

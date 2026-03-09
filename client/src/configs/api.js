import axios from "axios";

// Get API URL from Vite environment variable
const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach Bearer token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
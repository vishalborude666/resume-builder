import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// debug: expose to window and log type to help diagnose "api.post is not a function"
if (typeof window !== 'undefined') {
  // attach for quick inspection in browser console
  window.__api_instance = api;
}

console.log('configs/api -> axios instance:', api);

export default api;
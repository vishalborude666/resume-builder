import axios from 'axios'

const rawBase = import.meta.env.VITE_BASE_URL;
// strip surrounding quotes if present and provide a local fallback
const baseURL = (rawBase || '').replace(/^"|"$/g, '') || 'http://localhost:3000';

const api = axios.create({
   baseURL
})

export default api;
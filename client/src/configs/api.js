import axios from 'axios'

// Use Vite environment variable VITE_API_URL; fall back to empty string (relative URLs)
const rawBase = import.meta.env.VITE_API_URL || ''
// strip surrounding quotes if present
const baseURL = String(rawBase).replace(/^"|"$/g, '')

const api = axios.create({
  baseURL: baseURL || '', // empty = use same origin (works well on Vercel)
  withCredentials: true,
})

export default api
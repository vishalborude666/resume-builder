import axios from 'axios'


const api = import.meta.env.VITE_API_URL;

axios.post(`${api}/api/users/register`, data)

export default api;
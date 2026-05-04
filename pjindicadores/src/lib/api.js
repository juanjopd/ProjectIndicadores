import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true // 🔥 esto es lo único importante ahora
});

export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://SEU_IP_BACKEND:PORTA',
});

api.interceptors.request.use((config) => {
  const token = globalThis?.localStorage?.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

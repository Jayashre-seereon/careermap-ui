import axios from 'axios';
import { useAuthStore } from '../store/auth-store';

// ✅ Direct env usage (NO getBaseURL)
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// ✅ Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Auto attach access token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
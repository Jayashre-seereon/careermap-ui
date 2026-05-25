import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/auth-store';

const ENV_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const WEB_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_WEB;

function resolveApiBaseUrl() {
  if (Platform.OS === 'web' && WEB_API_BASE_URL) {
    return WEB_API_BASE_URL;
  }

  return ENV_API_BASE_URL;
}

export const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    const requestUrl = String(config.url || '');
    const isPublicAuthRoute =
      requestUrl.includes('/auth/login/password') ||
      requestUrl.includes('/auth/send-otp') ||
      requestUrl.includes('/auth/verify-otp');

    if (token && !isPublicAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

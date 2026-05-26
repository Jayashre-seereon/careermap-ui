import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/auth-store';

const ENV_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const WEB_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_WEB;

function getExpoHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest?.debuggerHost;

  if (!hostUri || typeof hostUri !== 'string') {
    return null;
  }

  return hostUri.split(':')[0] || null;
}

function cleanBaseUrl(baseUrl) {
  return baseUrl?.replace(/\/$/, '');
}

function resolveNativeApiBaseUrl(baseUrl) {
  if (!baseUrl) {
    return baseUrl;
  }

  try {
    const url = new URL(baseUrl);
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

    if (__DEV__) {
      const expoHost = getExpoHost();

      if (expoHost && isLocalhost) {
        url.hostname = expoHost;
        return cleanBaseUrl(url.toString());
      }
    }

    if (Platform.OS === 'android' && isLocalhost) {
      url.hostname = '10.0.2.2';
    }

    return cleanBaseUrl(url.toString());
  } catch {
    return cleanBaseUrl(baseUrl);
  }
}

function resolveApiBaseUrl() {
  if (Platform.OS === 'web' && WEB_API_BASE_URL) {
    return cleanBaseUrl(WEB_API_BASE_URL);
  }

  return resolveNativeApiBaseUrl(ENV_API_BASE_URL);
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

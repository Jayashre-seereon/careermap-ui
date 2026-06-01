import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/auth-store';

const ENV_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const WEB_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_WEB;
const ENV_AUTH_REFRESH_ENDPOINT = process.env.EXPO_PUBLIC_AUTH_REFRESH_ENDPOINT;

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
const AUTH_REFRESH_ENDPOINT = (() => {
  const endpoint = ENV_AUTH_REFRESH_ENDPOINT || '/auth/refresh-token';
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
})();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise = null;

function extractAuthPayload(data) {
  const payload = data?.data ?? data ?? {};

  return {
    accessToken: payload?.accessToken || payload?.access_token || payload?.token || '',
    refreshToken: payload?.refreshToken || payload?.refresh_token || '',
    user: payload?.user || null,
  };
}

async function refreshAccessToken() {
  const { refreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    throw new Error('Missing refresh token');
  }

  const response = await refreshClient.post(
    AUTH_REFRESH_ENDPOINT,
    {
      refreshToken,
      token: refreshToken,
    },
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  const authPayload = extractAuthPayload(response?.data);
  if (!authPayload.accessToken) {
    throw new Error('Refresh response did not include a new access token');
  }

  const authStore = useAuthStore.getState();
  authStore.setAccessToken(authPayload.accessToken);
  if (authPayload.refreshToken) {
    authStore.setRefreshToken(authPayload.refreshToken);
  }
  if (authPayload.user) {
    authStore.setUser(authPayload.user);
  }

  return authPayload.accessToken;
}

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    const requestUrl = String(config.url || '');
    const isPublicAuthRoute =
      requestUrl.includes('/auth/login/password') ||
      requestUrl.includes('/auth/send-otp') ||
      requestUrl.includes('/auth/verify-otp');
    const explicitAuthorization =
      config.headers?.Authorization || config.headers?.authorization;

    if (explicitAuthorization) {
      return config;
    }

    if (token && !isPublicAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    } else if (config.headers?.authorization) {
      delete config.headers.authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const serverMessage = String(error?.response?.data?.message || error?.response?.data?.error || '').toLowerCase();
    const originalRequest = error?.config;
    const requestUrl = String(originalRequest?.url || '');

    const looksLikeTokenExpiry =
      status === 401 || (status === 403 && /expired|jwt|token/i.test(serverMessage));

    if (!originalRequest || originalRequest._retry || !looksLikeTokenExpiry) {
      return Promise.reject(error);
    }

    if (requestUrl.includes('/auth/login/password') || requestUrl.includes('/auth/send-otp') || requestUrl.includes('/auth/verify-otp')) {
      return Promise.reject(error);
    }

    if (requestUrl.includes(AUTH_REFRESH_ENDPOINT)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api.request(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    }
  }
);

export default api;

import { create } from 'axios';
import { Platform } from 'react-native';

function getBaseURL() {
  const envBaseURL = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

  if (envBaseURL) {
    return envBaseURL;
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `http://${window.location.hostname}:5000/api`;
  }

  return 'http://localhost:5000/api';
}

export const API_BASE_URL = getBaseURL();

const api = create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

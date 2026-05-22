import api, { API_BASE_URL } from './axios';

export async function sendSignupOtp(mobile) {
  const response = await api.post('/auth/send-otp', {
    mobile,
    type: 'signup',
  });

  return response.data;
}

export async function verifySignupOtp(mobile, code) {
  const response = await api.post('/auth/verify-otp', {
    mobile,
    type: 'signup',
    code,
  });

  return response.data;
}

export async function signupUser(payload, tempToken) {
  const response = await api.post('/user/signup', payload, {
    headers: {
      Authorization: `Bearer ${tempToken}`,
    },
  });

  return response.data;
}

export function getApiErrorMessage(error, fallbackMessage) {
  if (error?.message === 'Network Error') {
    return `Network error. Check backend is running, phone and laptop are on same Wi-Fi, and API base URL is reachable: ${API_BASE_URL}`;
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
}

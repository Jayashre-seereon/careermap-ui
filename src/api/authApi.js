import api, { API_BASE_URL } from './axios';

// ✅ Send OTP
export async function sendSignupOtp(mobile) {
  const response = await api.post('/auth/send-otp', {
    mobile,
    type: 'signup',
  });

  return response.data;
}

// ✅ Verify OTP
export async function verifySignupOtp(mobile, code) {
  const response = await api.post('/auth/verify-otp', {
    mobile,
    type: 'signup',
    code,
  });

  return response.data;
}

// ✅ Signup
export async function signupUser(payload, tempToken) {
  const response = await api.post('/user/signup', payload, {
    headers: {
      Authorization: `Bearer ${tempToken}`, // only for this API
    },
  });

  return response.data;
}

// ✅ SAFE error handler
export function getApiErrorMessage(error, fallbackMessage = 'Something went wrong') {
  if (error?.message === 'Network Error') {
    if (__DEV__) {
      return `Network error. Check backend & URL: ${API_BASE_URL}`;
    }
    return 'Network error. Please try again.';
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
}
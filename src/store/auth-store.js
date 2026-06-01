import { create } from 'zustand';

const initialSignupForm = {
  name: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  city: '',
  state: '',
};

const initialOnboardingData = {
  userType: '',
  name: '',
  childName: '',
  selectedClass: '',
  selectedStream: '',
  selectedInterests: [],
  selectedClarity: '',
  selectedStrengths: [],
  selectedPriorities: [],
  selectedGuidance: '',
};

const AUTH_STORAGE_KEY = 'careermap-auth-store';

function readPersistedAuth() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return {
      accessToken: parsed?.state?.accessToken || '',
      refreshToken: parsed?.state?.refreshToken || '',
      user: parsed?.state?.user || null,
    };
  } catch {
    return {};
  }
}

function persistAuthState(state) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        state: {
          accessToken: state.accessToken || '',
          refreshToken: state.refreshToken || '',
          user: state.user || null,
        },
      })
    );
  } catch {
    // Ignore storage failures in private mode or restricted environments.
  }
}

export const useAuthStore = create((set) => ({
  signupForm: initialSignupForm,
  onboardingData: initialOnboardingData,
  tempToken: '',
  ...(() => {
    const persistedAuth = readPersistedAuth();

    return {
      accessToken: persistedAuth.accessToken || '',
      refreshToken: persistedAuth.refreshToken || '',
      user: persistedAuth.user || null,
    };
  })(),

  setSignupForm: (data) =>
    set((state) => ({
      signupForm: {
        ...state.signupForm,
        ...data,
      },
    })),

  setOnboardingData: (data) =>
    set(() => ({
      onboardingData: data,
    })),

  setTempToken: (tempToken) =>
    set(() => ({ tempToken })),

  setAccessToken: (accessToken) =>
    set((state) => {
      const nextState = { ...state, accessToken };
      persistAuthState(nextState);
      return { accessToken };
    }),

  setRefreshToken: (refreshToken) =>
    set((state) => {
      const nextState = { ...state, refreshToken };
      persistAuthState(nextState);
      return { refreshToken };
    }),

  setUser: (user) =>
    set((state) => {
      const nextState = { ...state, user };
      persistAuthState(nextState);
      return { user };
    }),

  clearAuthFlow: () =>
    set(() => ({
      signupForm: initialSignupForm,
      tempToken: '',
    })),

  logout: () =>
    set(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }

      return {
        tempToken: '',
        accessToken: '',
        refreshToken: '',
        user: null,
      };
    }),
}));

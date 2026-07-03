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
      profileIncomplete: Boolean(parsed?.state?.profileIncomplete),
    };
  } catch {
    return {};
  }
}

const persistedAuth = readPersistedAuth();
const hasPersistedAuthSession = Boolean(persistedAuth.accessToken || persistedAuth.refreshToken);

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
          profileIncomplete: Boolean(state.profileIncomplete),
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
  hasAuthenticatedSession: hasPersistedAuthSession,
  accessToken: persistedAuth.accessToken || '',
  refreshToken: persistedAuth.refreshToken || '',
  user: persistedAuth.user || null,
  profileIncomplete: Boolean(persistedAuth.profileIncomplete),

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

  markAuthenticatedSession: () =>
    set(() => ({ hasAuthenticatedSession: true })),

  setAccessToken: (accessToken) =>
    set((state) => {
      const nextState = { ...state, accessToken };
      persistAuthState(nextState);
      return { accessToken, hasAuthenticatedSession: Boolean(accessToken || state.refreshToken) };
    }),

  setRefreshToken: (refreshToken) =>
    set((state) => {
      const nextState = { ...state, refreshToken };
      persistAuthState(nextState);
      return { refreshToken, hasAuthenticatedSession: Boolean(state.accessToken || refreshToken) };
    }),

  setUser: (user) =>
    set((state) => {
      const nextState = { ...state, user };
      persistAuthState(nextState);
      return { user };
    }),

  setProfileIncomplete: (profileIncomplete) =>
    set((state) => {
      const nextState = { ...state, profileIncomplete };
      persistAuthState(nextState);
      return { profileIncomplete: Boolean(profileIncomplete) };
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
        profileIncomplete: false,
        hasAuthenticatedSession: false,
      };
    }),
}));

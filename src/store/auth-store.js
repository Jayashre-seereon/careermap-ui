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

export const useAuthStore = create((set) => ({
  signupForm: initialSignupForm,
  onboardingData: initialOnboardingData,
  tempToken: '',
  accessToken: '',
  user: null,
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
    set(() => ({
      tempToken,
    })),
  setAccessToken: (accessToken) =>
    set(() => ({
      accessToken,
    })),
  setUser: (user) =>
    set(() => ({
      user,
    })),
  clearAuthFlow: () =>
    set(() => ({
      signupForm: initialSignupForm,
      tempToken: '',
    })),
  logout: () =>
    set(() => ({
      tempToken: '',
      accessToken: '',
      user: null,
    })),
}));

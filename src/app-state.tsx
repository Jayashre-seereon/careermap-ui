import { createContext, useContext, useMemo, useState } from 'react';

type PlanId = 'psychometric' | 'premium' | 'infocentre' | null;
type FeatureKey = 'psychometric-test' | 'master-class' | 'book-mentor' | 'scholarship' | 'abroad-consultancy' | 'career-library';
type UserType = 'student' | 'parent' | '';

type OnboardingState = {
  userType: UserType;
  name: string;
  childName: string;
  selectedClass: string;
  selectedStream: string;
  selectedInterests: string[];
  selectedClarity: string;
  selectedStrengths: string[];
  selectedPriorities: string[];
  selectedGuidance: string;
};

type AppStateValue = {
  activePlanId: PlanId;
  hasActiveSubscription: boolean;
  isUnlocked: (feature: FeatureKey) => boolean;
  activatePlan: (planId: Exclude<PlanId, null>) => void;
  onboarding: OnboardingState;
  saveOnboarding: (data: OnboardingState) => void;
};

const planFeatures: Record<Exclude<PlanId, null>, FeatureKey[]> = {
  psychometric: ['psychometric-test'],
  premium: ['psychometric-test', 'book-mentor', 'master-class', 'career-library'],
  infocentre: ['psychometric-test', 'book-mentor', 'master-class', 'scholarship', 'abroad-consultancy', 'career-library'],
};

const initialOnboardingState: OnboardingState = {
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

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [activePlanId, setActivePlanId] = useState<PlanId>(null);
  const [onboarding, setOnboarding] = useState<OnboardingState>(initialOnboardingState);

  const value = useMemo<AppStateValue>(
    () => ({
      activePlanId,
      hasActiveSubscription: activePlanId !== null,
      onboarding,
      isUnlocked: (feature) => {
        if (!activePlanId) return false;
        return planFeatures[activePlanId].includes(feature);
      },
      activatePlan: (planId) => setActivePlanId(planId),
      saveOnboarding: (data) => setOnboarding(data),
    }),
    [activePlanId, onboarding],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return value;
}

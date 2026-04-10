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

type UserProfile = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  address: string;
  city: string;
  stateName: string;
  gender: string;
  dob: string;
  childName: string;
};

type NotificationPreferences = {
  pushNotifications: boolean;
  scholarshipAlerts: boolean;
  mentorReminders: boolean;
};

type AppPreferences = {
  darkMode: boolean;
  notifications: NotificationPreferences;
};

type HistoryItem = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
};

type BookingItem = {
  id: string;
  mentorName: string;
  date: string;
  time: string;
  status: string;
};

type SubscriptionRecord = {
  id: string;
  planName: string;
  price: string;
  expiryDate: string;
  transactionId: string;
};

type AppStateValue = {
  activePlanId: PlanId;
  hasActiveSubscription: boolean;
  isUnlocked: (feature: FeatureKey) => boolean;
  activatePlan: (planId: Exclude<PlanId, null>) => void;
  onboarding: OnboardingState;
  saveOnboarding: (data: OnboardingState) => void;
  userProfile: UserProfile;
  saveUserProfile: (data: UserProfile) => void;
  preferences: AppPreferences;
  updatePreferences: (data: Partial<AppPreferences>) => void;
  toggleDarkMode: () => void;
  savedCareers: string[];
  toggleSavedCareer: (career: string) => void;
  testHistory: HistoryItem[];
  addTestHistory: (item: HistoryItem) => void;
  bookings: BookingItem[];
  addBooking: (item: BookingItem) => void;
  subscriptionRecords: SubscriptionRecord[];
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

const initialUserProfile: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@email.com',
  mobile: '+91 98765 43210',
  password: 'Aarav@123',
  address: '24 Palm Residency',
  city: 'Bengaluru',
  stateName: 'Karnataka',
  gender: 'Male',
  dob: '2007-09-14',
  childName: '',
};

const initialPreferences: AppPreferences = {
  darkMode: false,
  notifications: {
    pushNotifications: true,
    scholarshipAlerts: true,
    mentorReminders: false,
  },
};

const initialSavedCareers = ['Software Engineering', 'UX Design', 'Psychology', 'Digital Marketing'];

const initialTestHistory: HistoryItem[] = [
  { id: '1', title: 'Personality Snapshot', subtitle: 'Completed on 08 Apr 2026', status: 'Completed' },
  { id: '2', title: 'Career Aptitude Test', subtitle: 'Scheduled for 13 Apr 2026', status: 'Upcoming' },
  { id: '3', title: 'Psychometric Summary', subtitle: 'Available in reports', status: 'Available' },
];

const initialBookings: BookingItem[] = [
  { id: '1', mentorName: 'Dr. Priya Sharma', date: '12 Apr 2026', time: '4:00 PM', status: 'Confirmed' },
  { id: '2', mentorName: 'Prof. Rahul Verma', date: '15 Apr 2026', time: '6:30 PM', status: 'Upcoming' },
];

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [activePlanId, setActivePlanId] = useState<PlanId>(null);
  const [onboarding, setOnboarding] = useState<OnboardingState>(initialOnboardingState);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [preferences, setPreferences] = useState<AppPreferences>(initialPreferences);
  const [savedCareers, setSavedCareers] = useState<string[]>(initialSavedCareers);
  const [testHistory, setTestHistory] = useState<HistoryItem[]>(initialTestHistory);
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);

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
      userProfile,
      saveUserProfile: (data) => setUserProfile(data),
      preferences,
      updatePreferences: (data) =>
        setPreferences((current) => ({
          ...current,
          ...data,
          notifications: {
            ...current.notifications,
            ...data.notifications,
          },
        })),
      toggleDarkMode: () => setPreferences((current) => ({ ...current, darkMode: !current.darkMode })),
      savedCareers,
      toggleSavedCareer: (career) =>
        setSavedCareers((current) =>
          current.includes(career) ? current.filter((item) => item !== career) : [...current, career],
        ),
      testHistory,
      addTestHistory: (item) =>
        setTestHistory((current) => {
          const filtered = current.filter((entry) => entry.id !== item.id);
          return [item, ...filtered];
        }),
      bookings,
      addBooking: (item) =>
        setBookings((current) => {
          const filtered = current.filter((entry) => entry.id !== item.id);
          return [item, ...filtered];
        }),
      subscriptionRecords: activePlanId
        ? [
            {
              id: activePlanId,
              planName:
                activePlanId === 'psychometric'
                  ? 'Psychometric Test'
                  : activePlanId === 'premium'
                    ? 'Psychometric + Counselling'
                    : 'Infocentre Access',
              price: activePlanId === 'psychometric' ? 'Rs 1,500' : activePlanId === 'premium' ? 'Rs 3,000' : 'Rs 5,000',
              expiryDate: '10 Apr 2027',
              transactionId: `TXN-${activePlanId.toUpperCase()}-2401`,
            },
          ]
        : [],
    }),
    [activePlanId, bookings, onboarding, preferences, savedCareers, testHistory, userProfile],
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

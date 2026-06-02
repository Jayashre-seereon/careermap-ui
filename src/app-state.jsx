import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { notifications as notificationItems } from './careermap-data';
import { getNotifications } from './api/notificationApi';
import { useAuthStore } from './store/auth-store';
const planFeatures = {
    psychometric: ['psychometric-test'],
    premium: ['psychometric-test', 'book-mentor', 'master-class'],
    infocentre: ['psychometric-test', 'book-mentor', 'master-class', 'scholarship', 'career-library'],
    abroad: ['abroad-consultancy'],
};
const initialOnboardingState = {
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
const initialUserProfile = {
    name: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    city: '',
    stateName: '',
    district: '',
    country: 'India',
    gender: '',
    dob: '',
    childName: '',
};
const initialPreferences = {
    darkMode: false,
    notifications: {
        pushNotifications: true,
        scholarshipAlerts: true,
        mentorReminders: false,
    },
};
const initialSavedCareers = ['Software Engineering', 'UX Design', 'Psychology', 'Digital Marketing'];
const initialTestHistory = [
    { id: '1', title: 'Personality Snapshot', subtitle: 'Completed on 08 Apr 2026', status: 'Completed' },
    { id: '2', title: 'Career Aptitude Test', subtitle: 'Scheduled for 13 Apr 2026', status: 'Upcoming' },
    { id: '3', title: 'Psychometric Summary', subtitle: 'Available in reports', status: 'Available' },
];
const initialBookings = [
    { id: '1', mentorName: 'Dr. Priya Sharma', date: '12 Apr 2026', time: '4:00 PM', status: 'Confirmed' },
    { id: '2', mentorName: 'Prof. Rahul Verma', date: '15 Apr 2026', time: '6:30 PM', status: 'Upcoming' },
];
const initialFreeAccessUsage = {
    'career-library': null,
    'master-class': null,
    'book-mentor': null,
    scholarship: null,
    'abroad-consultancy': null,
};
const AppStateContext = createContext(null);

const APP_STATE_STORAGE_KEY = 'careermap-app-state';

function readPersistedAppState() {
    if (typeof window === 'undefined' || !window.localStorage) {
        return {};
    }

    try {
        const raw = window.localStorage.getItem(APP_STATE_STORAGE_KEY);
        if (!raw) {
            return {};
        }

        const parsed = JSON.parse(raw);
        return {
            activePlanId: parsed?.activePlanId ?? null,
            freeAccessUsage: parsed?.freeAccessUsage ?? initialFreeAccessUsage,
        };
    }
    catch {
        return {};
    }
}

function persistAppState(nextState) {
    if (typeof window === 'undefined' || !window.localStorage) {
        return;
    }

    try {
        window.localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify({
            activePlanId: nextState.activePlanId ?? null,
            freeAccessUsage: nextState.freeAccessUsage ?? initialFreeAccessUsage,
        }));
    }
    catch {
        // Ignore storage failures in restricted browser modes.
    }
}

export function AppStateProvider({ children }) {
    const persistedAppState = readPersistedAppState();
    const [activePlanId, setActivePlanIdState] = useState(persistedAppState.activePlanId ?? null);
    const [profileEditRequestKey, setProfileEditRequestKey] = useState(0);
    const [promoMessage, setPromoMessage] = useState('');
    const [onboarding, setOnboarding] = useState(initialOnboardingState);
    const [userProfile, setUserProfile] = useState(initialUserProfile);
    const [preferences, setPreferences] = useState(initialPreferences);
    const [savedCareers, setSavedCareers] = useState(initialSavedCareers);
    const [testHistory, setTestHistory] = useState(initialTestHistory);
    const [bookings, setBookings] = useState(initialBookings);
    const [freeAccessUsage, setFreeAccessUsageState] = useState(persistedAppState.freeAccessUsage ?? initialFreeAccessUsage);
    const accessToken = useAuthStore((state) => state.accessToken);
    const hasAuthenticatedSession = useAuthStore((state) => state.hasAuthenticatedSession);
    const [notifications, setNotifications] = useState(notificationItems);
    const [notificationsLoadFailed, setNotificationsLoadFailed] = useState(false);

    useEffect(() => {
        if (!accessToken || !hasAuthenticatedSession) {
            setNotifications(notificationItems);
            setNotificationsLoadFailed(false);
            return undefined;
        }

        let isMounted = true;

        async function loadNotifications() {
            try {
                const items = await getNotifications();

                if (isMounted) {
                    setNotifications(items);
                    setNotificationsLoadFailed(false);
                }
            }
            catch (_error) {
                if (isMounted) {
                    setNotificationsLoadFailed(true);
                }
            }
        }

        loadNotifications();

        return () => {
            isMounted = false;
        };
    }, [accessToken, hasAuthenticatedSession]);

    const value = useMemo(() => ({
        activePlanId,
        hasActiveSubscription: activePlanId !== null,
        onboarding,
        isUnlocked: (feature) => {
            if (!activePlanId)
                return false;
            return planFeatures[activePlanId].includes(feature);
        },
        activatePlan: (planId) => {
            setActivePlanIdState(planId);
            persistAppState({
                activePlanId: planId,
                freeAccessUsage,
            });
        },
        canAccessFreeDetail: (feature, itemKey) => {
            if (activePlanId && planFeatures[activePlanId]?.includes(feature)) {
                return true;
            }
            const firstViewedItem = freeAccessUsage[feature];
            return firstViewedItem === null || firstViewedItem === itemKey;
        },
        registerFreeDetailAccess: (feature, itemKey) => setFreeAccessUsageState((current) => {
            if (activePlanId && planFeatures[activePlanId]?.includes(feature)) {
                return current;
            }
            if (current[feature] !== null) {
                return current;
            }
            const nextState = {
                ...current,
                [feature]: itemKey,
            };
            persistAppState({
                activePlanId,
                freeAccessUsage: nextState,
            });
            return nextState;
        }),
        resetFreeDetailAccess: (feature) => setFreeAccessUsageState((current) => {
            const nextState = {
                ...current,
                [feature]: null,
            };
            persistAppState({
                activePlanId,
                freeAccessUsage: nextState,
            });
            return nextState;
        }),
        profileEditRequestKey,
        requestProfileEdit: () => setProfileEditRequestKey((current) => current + 1),
        promoMessage,
        showPromoMessage: (message) => setPromoMessage(message),
        clearPromoMessage: () => setPromoMessage(''),
        saveOnboarding: (data) => setOnboarding(data),
        userProfile,
        saveUserProfile: (data) => setUserProfile(data),
        preferences,
        updatePreferences: (data) => setPreferences((current) => ({
            ...current,
            ...data,
            notifications: {
                ...current.notifications,
                ...data.notifications,
            },
        })),
        toggleDarkMode: () => setPreferences((current) => ({ ...current, darkMode: !current.darkMode })),
        savedCareers,
        toggleSavedCareer: (career) => setSavedCareers((current) => current.includes(career) ? current.filter((item) => item !== career) : [...current, career]),
        testHistory,
        addTestHistory: (item) => setTestHistory((current) => {
            const filtered = current.filter((entry) => entry.id !== item.id);
            return [item, ...filtered];
        }),
        bookings,
        addBooking: (item) => setBookings((current) => {
            const filtered = current.filter((entry) => entry.id !== item.id);
            return [item, ...filtered];
        }),
        subscriptionRecords: activePlanId
            ? [
                {
                    id: activePlanId,
                    planName: activePlanId === 'psychometric'
                        ? 'Psychometric Test'
                        : activePlanId === 'premium'
                            ? 'Psychometric + Counselling'
                            : activePlanId === 'infocentre'
                                ? 'Infocentre Access'
                                : 'Study Abroad Access',
                    price: activePlanId === 'psychometric'
                        ? 'Rs 1,500'
                        : activePlanId === 'premium'
                            ? 'Rs 3,000'
                            : activePlanId === 'infocentre'
                                ? 'Rs 5,000'
                                : 'Rs 2,500',
                    expiryDate: '10 Apr 2027',
                    transactionId: `TXN-${activePlanId.toUpperCase()}-2401`,
                },
            ]
            : [],
        notifications,
        unreadNotificationsCount: notifications.filter((item) => item.unread).length,
        notificationsLoadFailed,
        freeAccessUsage,
    }), [activePlanId, bookings, freeAccessUsage, notifications, notificationsLoadFailed, onboarding, preferences, profileEditRequestKey, promoMessage, savedCareers, testHistory, userProfile]);
    return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
export function useAppState() {
    const value = useContext(AppStateContext);
    if (!value) {
        throw new Error('useAppState must be used within AppStateProvider');
    }
    return value;
}

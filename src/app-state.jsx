import { createContext, useContext, useMemo, useState } from 'react';
import { notifications as notificationItems } from './careermap-data';
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
export function AppStateProvider({ children }) {
    const [activePlanId, setActivePlanId] = useState(null);
    const [profileEditRequestKey, setProfileEditRequestKey] = useState(0);
    const [promoMessage, setPromoMessage] = useState('');
    const [onboarding, setOnboarding] = useState(initialOnboardingState);
    const [userProfile, setUserProfile] = useState(initialUserProfile);
    const [preferences, setPreferences] = useState(initialPreferences);
    const [savedCareers, setSavedCareers] = useState(initialSavedCareers);
    const [testHistory, setTestHistory] = useState(initialTestHistory);
    const [bookings, setBookings] = useState(initialBookings);
    const [freeAccessUsage, setFreeAccessUsage] = useState(initialFreeAccessUsage);
    const value = useMemo(() => ({
        activePlanId,
        hasActiveSubscription: activePlanId !== null,
        onboarding,
        isUnlocked: (feature) => {
            if (!activePlanId)
                return false;
            return planFeatures[activePlanId].includes(feature);
        },
        activatePlan: (planId) => setActivePlanId(planId),
        canAccessFreeDetail: (feature, itemKey) => {
            if (activePlanId && planFeatures[activePlanId]?.includes(feature)) {
                return true;
            }
            const firstViewedItem = freeAccessUsage[feature];
            return firstViewedItem === null || firstViewedItem === itemKey;
        },
        registerFreeDetailAccess: (feature, itemKey) => setFreeAccessUsage((current) => {
            if (activePlanId && planFeatures[activePlanId]?.includes(feature)) {
                return current;
            }
            if (current[feature] !== null) {
                return current;
            }
            return {
                ...current,
                [feature]: itemKey,
            };
        }),
        resetFreeDetailAccess: (feature) => setFreeAccessUsage((current) => ({
            ...current,
            [feature]: null,
        })),
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
        unreadNotificationsCount: notificationItems.filter((item) => item.unread).length,
        freeAccessUsage,
    }), [activePlanId, bookings, freeAccessUsage, onboarding, preferences, profileEditRequestKey, promoMessage, savedCareers, testHistory, userProfile]);
    return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
export function useAppState() {
    const value = useContext(AppStateContext);
    if (!value) {
        throw new Error('useAppState must be used within AppStateProvider');
    }
    return value;
}

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { notifications as notificationItems } from './careermap-data';
import { ensureAccessToken } from './api/axios';
import { getNotifications } from './api/notificationApi';
import { getMentorBookings, getSubscriptions, getTestHistory } from './api/profile';
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

function extractResponseItems(response) {
    const candidates = [
        response?.data?.data,
        response?.data?.results,
        response?.data,
        response?.results,
        response,
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate.filter(Boolean);
        }
    }

    return [];
}

function formatDateLabel(value) {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatValidityDays(value) {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    const numericValue = Number(value);
    if (!Number.isNaN(numericValue) && String(value).trim() !== '') {
        return `${numericValue} days`;
    }

    return formatDateLabel(value);
}

function mapTestHistoryItem(item, index = 0) {
    const title = item?.title || item?.testName || item?.quizName || item?.name || `Test ${index + 1}`;
    const statusText = item?.status || item?.result || item?.attemptStatus || '';
    const dateText = formatDateLabel(item?.completedAt || item?.completed_at || item?.createdAt || item?.created_at || item?.date);
    const scoreText = item?.score != null ? `Score: ${item.score}` : '';
    const subtitle = [statusText ? `Status: ${statusText}` : '', dateText ? `Date: ${dateText}` : '', scoreText].filter(Boolean).join(' • ');

    return {
        id: String(item?.id ?? `test-${index}`),
        title,
        subtitle: subtitle || item?.subtitle || 'Test history item',
        status: statusText || 'Completed',
    };
}

function mapBookingItem(item, index = 0) {
    const mentorName = item?.mentorName || item?.mentor?.name || item?.mentor?.fullName || item?.mentor?.mentorName || `Mentor Booking ${index + 1}`;
    const date = formatDateLabel(item?.date || item?.bookingDate || item?.appointmentDate || item?.scheduledAt || item?.slotDate);
    const time = item?.time || item?.slotTime || item?.startTime || item?.appointmentTime || item?.slot || '';

    return {
        id: String(item?.id ?? `booking-${index}`),
        mentorName,
        date: date || 'Date not available',
        time: time || 'Time not available',
        status: item?.status || item?.bookingStatus || 'Confirmed',
    };
}

function mapSubscriptionItem(item, index = 0) {
    const planName = item?.planName || item?.plan_name || item?.plan?.name || item?.plan || `Subscription ${index + 1}`;
    const expiryDate = formatDateLabel(item?.expiryDate || item?.expiry_date || item?.endDate || item?.validUntil || item?.renewalDate);
    const transactionId = item?.transactionId || item?.transaction_id || item?.transaction || item?.reference || '';
    const price = item?.price != null ? `Rs ${item.price}` : item?.amount != null ? `Rs ${item.amount}` : '';

    return {
        id: String(item?.id ?? `subscription-${index}`),
        planName,
        price: price || 'Subscription active',
        expiryDate: expiryDate || 'Expiry date not available',
        transactionId: transactionId || 'Transaction not available',
        status: item?.status || 'Active',
    };
}

function getPlanIdFromSubscription(item) {
    const planText = String(item?.planName || item?.plan_name || item?.plan?.name || item?.plan || '').toLowerCase();

    if (planText.includes('psychometric') && planText.includes('counsell')) {
        return 'premium';
    }

    if (planText.includes('psychometric')) {
        return 'psychometric';
    }

    if (planText.includes('infocentre') || planText.includes('info centre')) {
        return 'infocentre';
    }

    if (planText.includes('abroad')) {
        return 'abroad';
    }

    if (planText.includes('premium')) {
        return 'premium';
    }

    return '';
}

function normalizeTestHistoryItems(items = []) {
    return items.map((item, index) => {
        const mapped = mapTestHistoryItem(item, index);
        const quizName = item?.quiz?.title || item?.quizName || item?.quiz_name || item?.testName || item?.test_name || mapped.title;
        const attemptedAtRaw = item?.attemptedAt || item?.attempted_at || item?.submittedAt || item?.submitted_at || item?.completedAt || item?.completed_at || item?.createdAt || item?.created_at || item?.date || "";
        const attemptedAt = formatDateLabel(attemptedAtRaw);
        const score = item?.score != null ? String(item.score) : item?.correctAnswers != null && item?.totalQuestions != null ? `${item.correctAnswers}/${item.totalQuestions}` : item?.marks != null ? String(item.marks) : mapped.score || '';

        return {
            ...mapped,
            title: quizName,
            quizName,
            score,
            attemptedAt,
            attemptedAtRaw,
        };
    });
}

function normalizeBookingItems(items = []) {
    return items.map((item, index) => {
        const mapped = mapBookingItem(item, index);
        const mentorFee = item?.mentor?.mentor_fees ?? item?.mentorFee ?? item?.fee ?? item?.amount ?? item?.payment?.amount ?? item?.price ?? item?.mentor?.fee ?? mapped.mentorFee ?? '';
        const timeSlot = item?.timeSlot || item?.slot || item?.payment?.timeSlot || mapped.timeSlot || mapped.time || '';
        const mentorName = item?.mentor?.name || item?.mentorName || item?.mentor?.fullName || item?.mentor?.mentorName || mapped.mentorName;

        return {
            ...mapped,
            mentorName,
            mentorFee,
            timeSlot,
            date: formatDateLabel(item?.date || item?.bookingDate || item?.appointmentDate || item?.scheduledAt || item?.slotDate || mapped.date),
        };
    });
}

function normalizeSubscriptionItems(items = []) {
    return items.map((item, index) => {
        const mapped = mapSubscriptionItem(item, index);
        const subscriptionName = item?.plan?.name || item?.subscriptionName || item?.subscription_name || item?.planName || mapped.planName;
        const amount = item?.amount != null ? item.amount : item?.plan?.price != null ? item.plan.price : item?.price != null ? item.price : mapped.amount || '';
        const validity = formatValidityDays(item?.plan?.validity ?? item?.validity ?? item?.validityDays ?? item?.daysValid ?? item?.subscriptionValidity ?? mapped.validity);
        const expiryDate = formatDateLabel(item?.endDate || item?.expiryDate || item?.expiry_date || item?.validUntil || item?.renewalDate);

        return {
            ...mapped,
            planName: subscriptionName,
            subscriptionName,
            amount,
            validity: validity || mapped.validity,
            expiryDate: expiryDate || mapped.expiryDate,
            price: amount !== '' ? `Rs ${amount}` : mapped.price,
        };
    });
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
    const [subscriptionRecords, setSubscriptionRecords] = useState(
        persistedAppState.activePlanId
            ? [
                {
                    id: persistedAppState.activePlanId,
                    planName: persistedAppState.activePlanId === 'psychometric'
                        ? 'Psychometric Test'
                        : persistedAppState.activePlanId === 'premium'
                            ? 'Psychometric + Counselling'
                            : persistedAppState.activePlanId === 'infocentre'
                                ? 'Infocentre Access'
                                : 'Study Abroad Access',
                    price: persistedAppState.activePlanId === 'psychometric'
                        ? 'Rs 1,500'
                        : persistedAppState.activePlanId === 'premium'
                            ? 'Rs 3,000'
                            : persistedAppState.activePlanId === 'infocentre'
                                ? 'Rs 5,000'
                                : 'Rs 2,500',
                    expiryDate: '10 Apr 2027',
                    transactionId: `TXN-${String(persistedAppState.activePlanId).toUpperCase()}-2401`,
                },
            ]
            : []
    );
    const [freeAccessUsage, setFreeAccessUsageState] = useState(persistedAppState.freeAccessUsage ?? initialFreeAccessUsage);
    const accessToken = useAuthStore((state) => state.accessToken);
    const refreshToken = useAuthStore((state) => state.refreshToken);
    const hasAuthenticatedSession = useAuthStore((state) => state.hasAuthenticatedSession);
    const markAuthenticatedSession = useAuthStore((state) => state.markAuthenticatedSession);
    const [notifications, setNotifications] = useState(notificationItems);
    const [notificationsLoadFailed, setNotificationsLoadFailed] = useState(false);

    useEffect(() => {
        if ((accessToken || refreshToken) && !hasAuthenticatedSession) {
            markAuthenticatedSession();
        }

        if (!accessToken && refreshToken) {
            void ensureAccessToken().catch(() => {
                // The axios layer handles session cleanup on refresh failure.
            });
        }
    }, [accessToken, hasAuthenticatedSession, markAuthenticatedSession, refreshToken]);

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

    useEffect(() => {
        if (!accessToken || !hasAuthenticatedSession) {
            setTestHistory(initialTestHistory);
            setBookings(initialBookings);
            return undefined;
        }

        let isMounted = true;

        async function loadProfileSections() {
            try {
                const [testResponse, bookingResponse, subscriptionResponse] = await Promise.all([
                    getTestHistory().catch(() => null),
                    getMentorBookings().catch(() => null),
                    getSubscriptions().catch(() => null),
                ]);

                if (!isMounted) {
                    return;
                }

                const testItems = extractResponseItems(testResponse);
                const bookingItems = extractResponseItems(bookingResponse);
                const subscriptionItems = extractResponseItems(subscriptionResponse);

                setTestHistory(testItems.length > 0 ? normalizeTestHistoryItems(testItems) : initialTestHistory);
                setBookings(bookingItems.length > 0 ? normalizeBookingItems(bookingItems) : initialBookings);

                if (subscriptionItems.length > 0) {
                    const normalizedSubscriptions = normalizeSubscriptionItems(subscriptionItems);
                    setSubscriptionRecords(normalizedSubscriptions);
                    const activeSubscriptionIndex = subscriptionItems.findIndex((item) => String(item?.status || '').toLowerCase() === 'active');
                    const activeSubscription = activeSubscriptionIndex >= 0 ? normalizedSubscriptions[activeSubscriptionIndex] : normalizedSubscriptions[0];

                    if (activeSubscription && !activePlanId) {
                        const derivedPlanId = getPlanIdFromSubscription(activeSubscription);
                        if (derivedPlanId) {
                            setActivePlanIdState(derivedPlanId);
                        }
                    }

                    if (activeSubscription && activeSubscriptionIndex >= 0 && !activePlanId) {
                        const derivedPlanId = getPlanIdFromSubscription(subscriptionItems[activeSubscriptionIndex]);
                        if (derivedPlanId) {
                            setActivePlanIdState(derivedPlanId);
                        }
                    }
                }
            }
            catch {
                if (isMounted) {
                    setTestHistory(initialTestHistory);
                    setBookings(initialBookings);
                    setSubscriptionRecords(activePlanId
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
                                transactionId: `TXN-${String(activePlanId).toUpperCase()}-2401`,
                            },
                        ]
                        : []);
                }
            }
        }

        loadProfileSections();

        return () => {
            isMounted = false;
        };
    }, [accessToken, activePlanId, hasAuthenticatedSession]);

    const value = useMemo(() => ({
        activePlanId,
        hasActiveSubscription: activePlanId !== null,
        onboarding,
       isUnlocked: (feature) => {
            if (!activePlanId)
                return false;
            return (planFeatures[activePlanId] || []).includes(feature);
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
        subscriptionRecords,
        notifications,
        unreadNotificationsCount: notifications.filter((item) => item.unread).length,
        notificationsLoadFailed,
        freeAccessUsage,
  }), [activePlanId, bookings, freeAccessUsage, notifications, notificationsLoadFailed, onboarding, preferences, profileEditRequestKey, promoMessage, savedCareers, subscriptionRecords, testHistory, userProfile]);
    return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
export function useAppState() {
    const value = useContext(AppStateContext);
    if (!value) {
        throw new Error('useAppState must be used within AppStateProvider');
    }
    return value;
}

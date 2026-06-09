import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../src/api/axios';
import { checkModuleAccess } from '../../../src/api/moduleAccessApi';
import { useAppState } from '../../../src/app-state';
import { AnimatedPressable, Pill, Screen, SectionHeader, UnlockBottomSheet } from '../../../src/careermap-ui';
import { openSubscriptionPrompt } from '../../../src/subscription-flow';
import { featuredInstitutes, featuredMentors, featuredScholarships, moduleCards, palette, studentProfile } from '../../../src/careermap-data';
const getMentorInitials = (mentor) => {
    const source = String(mentor?.name || 'M').trim();
    const initials = source
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

    return initials || 'M';
};
const renderMentorAvatar = (mentor, size = 52) => {
    if (mentor?.image) {
        return (<Image source={{ uri: mentor.image }} resizeMode="cover" style={{
                width: size,
                height: size,
                borderRadius: 18,
            }}/>);
    }

    return (<View className="items-center justify-center" style={{
            width: size,
            height: size,
            borderRadius: 18,
            backgroundColor: `${mentor?.accent || palette.primary}14`,
            borderWidth: 1,
            borderColor: `${mentor?.accent || palette.primary}18`,
        }}>
      <Text className="text-[18px] font-black" style={{ color: mentor?.accent || palette.primary, lineHeight: 22 }}>
        {getMentorInitials(mentor)}
      </Text>
    </View>);
};
const personalityQuestions = [
    { q: 'When faced with a problem, I prefer to:', options: ['Analyze data systematically', 'Brainstorm creative solutions', 'Discuss with others', 'Act quickly on instinct'] },
    { q: 'In my free time, I enjoy:', options: ['Reading or researching', 'Creating art or music', 'Socializing with friends', 'Physical activities or sports'] },
    { q: 'I work best when:', options: ['I have a clear plan', 'I can be spontaneous', 'I collaborate with a team', 'I work independently'] },
    { q: 'I am most motivated by:', options: ['Achieving goals', 'Expressing myself', 'Helping others', 'Learning new skills'] },
    { q: 'My ideal workspace is:', options: ['Organized and quiet', 'Colorful and inspiring', 'Open and collaborative', 'Flexible and mobile'] },
    { q: 'When making decisions, I rely on:', options: ['Logic and facts', 'Intuition and feelings', 'Advice from others', 'Past experiences'] },
];
const personalityTypes = [
    { type: 'The Analytical Thinker', desc: 'You thrive in structured environments and enjoy solving complex problems with logic and clarity.', careers: ['Engineering', 'Data Science', 'Finance', 'Research'] },
    { type: 'The Creative Visionary', desc: 'You bring imagination, originality, and expressive thinking to everything you work on.', careers: ['Design', 'Architecture', 'Media', 'Marketing'] },
    { type: 'The Empathetic Helper', desc: 'You naturally connect with people and do well in roles built around support, care, and communication.', careers: ['Psychology', 'Teaching', 'Medicine', 'HR'] },
    { type: 'The Dynamic Explorer', desc: 'You enjoy variety, energy, and fast-moving environments where action leads the way.', careers: ['Business', 'Travel', 'Sports', 'Entrepreneurship'] },
];
export default function HomeScreen() {
    const { preferences } = useAppState();
    const [showPersonalityTest, setShowPersonalityTest] = useState(false);
    const [completedPersonality, setCompletedPersonality] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(Array(personalityQuestions.length).fill(null));
    const [dashboardData, setDashboardData] = useState(null);
    const [lockedModule, setLockedModule] = useState(null);
    const { isUnlocked, onboarding, unreadNotificationsCount, userProfile } = useAppState();
    const { width } = useWindowDimensions();
    const moduleCardWidth = width < 390 ? '48%' : '31%';
    const featureByTitle = {
        'Career Library': 'career-library',
        'Master Class': 'master-class',
        'Book Mentor': 'book-mentor',
        'Scholarships': 'scholarship',
        'Study Abroad': 'abroad-consultancy',
    };
    const normalizeModuleTitle = (value) => value?.trim().toLowerCase().replace(/\s+/g, ' ');
    const resolveModuleLookupKey = (value) => {
        const normalized = normalizeModuleTitle(value);
        if (normalized === 'scholarship') {
            return 'scholarships';
        }
        if (normalized === 'masterclass' || normalized === 'masterclasses') {
            return 'master class';
        }
        return normalized;
    };
    const loadDashboard = async (isMountedRef) => {
        try {
            const response = await api.get('/user/dashboard');
            if ((!isMountedRef || isMountedRef.current) && response?.data?.success) {
                setDashboardData(response.data.data);
            }
        }
        catch (error) {
            console.log('Dashboard fetch failed', error?.response?.data || error?.message || error);
        }
    };
    useEffect(() => {
        const isMountedRef = { current: true };
        loadDashboard(isMountedRef);
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    useFocusEffect(useCallback(() => {
        loadDashboard();
    }, []));
    const dashboardUserName = useMemo(() => {
        const firstName = dashboardData?.user?.firstName?.trim();
        const lastName = dashboardData?.user?.lastName?.trim();
        const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
        return fullName || userProfile.name || onboarding.name || studentProfile.name;
    }, [dashboardData?.user?.firstName, dashboardData?.user?.lastName, onboarding.name, userProfile.name]);
    const dashboardModules = useMemo(() => {
        if (!dashboardData?.modules?.length) {
            return moduleCards.map((card) => ({
                ...card,
                id: card.title,
                lockTitle: card.title,
            }));
        }
        const moduleCardMap = new Map(moduleCards.map((card) => [resolveModuleLookupKey(card.title), card]));
        return dashboardData.modules
            .map((module) => {
            const matchedCard = moduleCardMap.get(resolveModuleLookupKey(module.title));
            if (!matchedCard) {
                return null;
            }
            return {
                ...matchedCard,
                id: module.id,
                lockTitle: matchedCard.title,
                title: module.title || matchedCard.title,
            };
        })
            .filter(Boolean);
    }, [dashboardData?.modules]);
    const dashboardMentors = useMemo(() => {
        if (!dashboardData?.mentors?.length) {
            return featuredMentors;
        }
        return dashboardData.mentors.map((mentor, index) => ({
            ...featuredMentors[index % featuredMentors.length],
            id: mentor.id,
            name: mentor.name || featuredMentors[index % featuredMentors.length].name,
            specialty: mentor.designation || featuredMentors[index % featuredMentors.length].specialty,
            rating: mentor.rank || featuredMentors[index % featuredMentors.length].rating,
            experience: mentor.experience ? `${mentor.experience} yrs` : featuredMentors[index % featuredMentors.length].experience,
            image: mentor.image || featuredMentors[index % featuredMentors.length].image || null,
        }));
    }, [dashboardData?.mentors]);
    const dashboardScholarships = useMemo(() => {
        if (!dashboardData?.scholarships?.length) {
            return featuredScholarships;
        }
        return dashboardData.scholarships.map((item) => ({
            id: item.id,
            name: item.name || '',
            amount: item.price ? `Rs ${item.price} / year` : '',
            deadline: item.deadline ? new Date(item.deadline).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }) : '',
            tag: item.type || '',
        }));
    }, [dashboardData?.scholarships]);
    const dashboardInstitutes = useMemo(() => {
        if (!dashboardData?.institutions?.length) {
            return featuredInstitutes;
        }
        return dashboardData.institutions.map((item) => ({
            id: item.id,
            name: item.name || '',
            location: item.state || '',
            type: item.institute_type || '',
            logo: item.logo || null,
        }));
        }, [dashboardData?.institutions]);
    const handleModulePress = async (card) => {
        const moduleId = Number(card?.id);

        if (!Number.isFinite(moduleId)) {
            const fallbackFeature = featureByTitle[card?.lockTitle || card?.title || ''];

            if (fallbackFeature && !isUnlocked(fallbackFeature)) {
                setLockedModule({
                    title: card.title,
                    route: card.route,
                    moduleId: null,
                    message: 'Please purchase a subscription to continue accessing this module.',
                });
                return;
            }

            router.push(card.route);
            return;
        }

        try {
            const response = await checkModuleAccess(moduleId);

            if (!response?.allowed) {
                setLockedModule({
                    title: card.title,
                    route: card.route,
                    moduleId,
                    message: response?.message || 'Free preview already used. Please purchase a subscription to continue accessing this module.',
                });
                return;
            }

            router.push({
                pathname: card.route,
                params: {
                    moduleId: String(moduleId),
                    accessStatus: response?.freePreview ? 'preview' : 'unlocked',
                },
            });
        } catch (error) {
            console.log('Module access check failed', error?.response?.data || error?.message || error);
            router.push(card.route);
        }
    };
    const personalityResult = useMemo(() => {
        const counts = [0, 0, 0, 0];
        answers.forEach((answer) => {
            if (answer !== null)
                counts[answer] += 1;
        });
        
        return personalityTypes[counts.indexOf(Math.max(...counts))];
    }, [answers]);
    const resetPersonality = () => {
        setShowPersonalityTest(false);
        setCompletedPersonality(false);
        setCurrentQuestion(0);
    };
    if (showPersonalityTest && !completedPersonality) {
        const current = personalityQuestions[currentQuestion];
        return (<Screen>
        <View className="flex-row items-center gap-3">
          <AnimatedPressable className={`h-[38px] w-[38px] items-center justify-center rounded-[12px] border ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} onPress={resetPersonality}>
            <Ionicons name="chevron-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
          </AnimatedPressable>
          <Text className={`text-[18px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Know Your Personality</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <View className={`h-2 flex-1 overflow-hidden rounded-full ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#e8e2de]'}`}>
            <View className="h-full rounded-full bg-brand" style={{ width: `${((currentQuestion + 1) / personalityQuestions.length) * 100}%` }}/>
          </View>
          <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{currentQuestion + 1}/{personalityQuestions.length}</Text>
        </View>

        <View className={`gap-2 rounded-[24px] border p-5 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
          <Text className={`text-[11px] font-extrabold uppercase tracking-[0.8px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Question {currentQuestion + 1}</Text>
          <Text className={`text-[18px] font-extrabold leading-[26px] ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{current.q}</Text>
        </View>

        <View className="gap-3">
          {current.options.map((option, index) => {
                const active = answers[currentQuestion] === index;
                return (<AnimatedPressable key={option} className={`rounded-[18px] border p-4 ${active ? 'border-brand bg-brand' : preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} onPress={() => {
                        const next = [...answers];
                        next[currentQuestion] = index;
                        setAnswers(next);
                    }}>
                <Text className={`text-[14px] font-bold ${active ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{String.fromCharCode(65 + index)}. {option}</Text>
              </AnimatedPressable>);
            })}
        </View>

        <View className="flex-row gap-3">
          <AnimatedPressable className={`min-w-[112px] flex-1 items-center rounded-[16px] border px-5 py-[14px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} disabled={currentQuestion === 0} onPress={() => setCurrentQuestion((value) => value - 1)}>
            <Text className={`text-[14px] font-extrabold ${currentQuestion === 0 ? preferences.darkMode ? 'text-[#6d6270]' : 'text-muted' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>Previous</Text>
          </AnimatedPressable>
          <AnimatedPressable className="min-w-[112px] flex-1 items-center rounded-[16px] bg-brand px-5 py-[14px]" disabled={answers[currentQuestion] === null} onPress={() => currentQuestion < personalityQuestions.length - 1 ? setCurrentQuestion((value) => value + 1) : setCompletedPersonality(true)}>
            <Text className="text-[14px] font-extrabold text-white">{currentQuestion < personalityQuestions.length - 1 ? 'Next' : 'See Results'}</Text>
          </AnimatedPressable>
        </View>
      </Screen>);
    }
    if (showPersonalityTest && completedPersonality) {
        return (<Screen>
        <View className="items-center gap-[14px]">
          <Text className="text-[28px] font-black text-brand">Spark</Text>
          <Text className={`text-center text-[28px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Your Personality</Text>
          <View className="rounded-[18px] px-[18px] py-[10px]" style={{ backgroundColor: `${palette.primary}12` }}>
            <Text className="text-[18px] font-black text-brand">{personalityResult.type}</Text>
          </View>
          <Text className={`text-center text-[14px] leading-[22px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{personalityResult.desc}</Text>

          <View className={`w-full gap-2.5 rounded-[24px] border p-[18px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
            <Text className={`text-[16px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Recommended Careers</Text>
            <View className="flex-row flex-wrap gap-2">
              {personalityResult.careers.map((career) => (<Pill key={career} label={career} tone={palette.primary}/>))}
            </View>
          </View>

          <View className={`w-full gap-2.5 rounded-[24px] border p-[18px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
            <Text className={`text-[16px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Get a Full Psychometric Analysis</Text>
            <Text className={`text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Take the deeper assessment to unlock a richer career report with stronger recommendations.</Text>
            <AnimatedPressable className="rounded-[16px] bg-brand py-[14px]" onPress={() => router.push('/(drawer)/(tabs)/assessment')}>
              <Text className="text-center text-[14px] font-extrabold text-white">Take Full Psychometric Test</Text>
            </AnimatedPressable>
          </View>

          <AnimatedPressable className={`w-full items-center rounded-[16px] border px-[14px] py-[14px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} onPress={resetPersonality}>
            <Text className={`text-[14px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Back to Dashboard</Text>
          </AnimatedPressable>
        </View>
      </Screen>);
    }
    return (<Screen>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: `${palette.primary}12` }}>
            <Text className="text-[20px] font-black text-brand">{dashboardUserName.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
              <Text className={`text-[18px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{dashboardUserName}</Text>
          </View>
        </View>
        <AnimatedPressable className={`h-[42px] w-[42px] items-center justify-center rounded-[16px] border ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} onPress={() => router.push('/(drawer)/notifications')}>
          <View className="items-center justify-center">
            <Ionicons name="notifications-outline" size={20} color={preferences.darkMode ? '#ffffff' : palette.text}/>
            {unreadNotificationsCount > 0 ? (<View className="absolute -right-2 -top-2 min-w-[18px] rounded-full bg-brand px-1 py-[1px]">
                <Text className="text-center text-[10px] font-extrabold text-white">{unreadNotificationsCount}</Text>
              </View>) : null}
          </View>
        </AnimatedPressable>
      </View>

      <View className="overflow-hidden rounded-[28px] bg-brand p-[22px]" style={{ marginTop: 18 ,marginBottom: 12}}>
        <View className="absolute bottom-[-34px] right-[-28px] h-[148px] w-[148px] rounded-full bg-white/10"/>
       
        <View className="gap-2">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="sparkles" size={14} color="#f6ce63"/>
            <Text className="text-[11px] font-extrabold uppercase tracking-[1px] text-[#f6ce63]">Recommended</Text>
          </View>
          <Text className="text-[28px] font-black text-white">Know Your Personality</Text>
          <Text className="max-w-[80%] text-[13px] leading-5 text-white/80">
            {isUnlocked('psychometric-test')
            ? 'Take the comprehensive psychometric test to get detailed career insights and recommendations.'
            : 'Answer quick questions to discover your personality type and ideal career direction.'}
          </Text>
          <AnimatedPressable className="mt-1 self-start rounded-full bg-white px-4 py-2.5" onPress={() => isUnlocked('psychometric-test') ? router.push('/(drawer)/psychometric-test') : setShowPersonalityTest(true)}>
            <Text className="text-[13px] font-extrabold text-brand">{isUnlocked('psychometric-test') ? 'Take Full Psychometric Test' : 'Take the Test'}</Text>
          </AnimatedPressable>
        </View>
      </View>

      <SectionHeader title="Explore Modules" />
      <View className="flex-row flex-wrap gap-3 mt-4 mb-2">
        {dashboardModules.map((card) => {
                return (<AnimatedPressable key={card.id || card.title} style={{ width: moduleCardWidth }} onPress={() => handleModulePress(card)}>
        <View className={`relative aspect-square items-center justify-center gap-2 rounded-[22px] border p-[14px] ${preferences.darkMode ? 'bg-[#080808]' : 'bg-card'}`} style={{ borderColor: preferences.darkMode ? '#1a1a1a' : `${card.tone}30` }}>
              <View className="h-[42px] w-[42px] items-center justify-center rounded-[14px]" style={{ backgroundColor: `${card.tone}14` }}>
                <Ionicons name={card.icon} size={21} color={card.tone}/>
              </View>
              <View className="min-h-[34px] w-full items-center justify-center">
                <Text adjustsFontSizeToFit minimumFontScale={0.72} numberOfLines={2} className={`w-full text-center text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{card.title}</Text>
              </View>
            </View>
          </AnimatedPressable>);
            })}
      </View>

      <SectionHeader title="Explore Your Mentors" action={<AnimatedPressable onPress={() => router.push('/(drawer)/book-mentor')}><Text className="text-[12px] font-extrabold text-brand mt-4 ">See all</Text></AnimatedPressable>}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 pr-2">
        {dashboardMentors.map((mentor) => (<AnimatedPressable key={mentor.id || mentor.name} className={`h-[168px] w-[164px] items-center gap-1.5 rounded-[22px] border p-4 mb-4 mt-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} onPress={() => router.push('/(drawer)/book-mentor')}>
            <View className="h-[52px] w-[52px] overflow-hidden rounded-[18px] " style={{ backgroundColor: `${mentor.accent}15` }}>
              {renderMentorAvatar(mentor)}
            </View>
            <View className="h-[34px] justify-center">
              <Text numberOfLines={2} ellipsizeMode="tail" className={`text-center text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{mentor.name}</Text>
            </View>
            <Text numberOfLines={1} ellipsizeMode="tail" className="w-full text-center text-[11px] font-bold text-brand">{mentor.specialty}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className={`w-full text-center text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{mentor.rating} rank | {mentor.experience}</Text>
          </AnimatedPressable>))}
      </ScrollView>

      <SectionHeader title="Explore Scholarships" action={<AnimatedPressable onPress={() => router.push('/(drawer)/scholarship')}><Text className="text-[12px] font-extrabold text-brand">See all</Text></AnimatedPressable>}/>
      <View className="gap-3 mb-4 mt-4">
        {dashboardScholarships.map((item) => (<AnimatedPressable key={item.id || item.name} className={`flex-row items-center gap-3 rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} onPress={() => router.push('/(drawer)/scholarship')}>
            <View className={`h-[42px] w-[42px] items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#163126]' : 'bg-[#edf9f1]'}`}>
              <Ionicons name="ribbon-outline" size={20} color={palette.green}/>
            </View>
            <View className="flex-1 gap-0.5">
              <Text numberOfLines={1} ellipsizeMode="tail" className={`text-[14px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.name}</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" className="text-[12px] font-bold text-success">{item.amount}</Text>
            </View>
            <View className="items-end gap-1">
              <Pill label={item.tag} tone={palette.primary}/>
              <Text numberOfLines={1} ellipsizeMode="tail" className={`text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.deadline}</Text>
            </View>
          </AnimatedPressable>))}
      </View>

      <SectionHeader title="Explore Institutes" action={<AnimatedPressable onPress={() => router.push('/(drawer)/institute')}><Text className="text-[12px] font-extrabold text-brand">See all</Text></AnimatedPressable>}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 pr-2">
        {dashboardInstitutes.map((item) => (<AnimatedPressable key={item.id || item.name} className={`h-[196px] w-[164px] items-center gap-1.5 rounded-[22px] border p-4 mb-4 mt-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} onPress={() => router.push('/(drawer)/institute')}>
            <View className="h-[52px] w-[52px] overflow-hidden rounded-[18px]" style={{ backgroundColor: `${palette.blue}14` }}>
              {item.logo ? (<Image source={{ uri: item.logo }} resizeMode="cover" style={{ width: 52, height: 52, borderRadius: 18 }}/>) : (<View className="h-[52px] w-[52px] items-center justify-center rounded-[18px]" style={{ backgroundColor: `${palette.blue}14`, borderWidth: 1, borderColor: `${palette.blue}18` }}>
                  <Text className="text-[16px] font-black" style={{ color: palette.blue, lineHeight: 20 }}>
                    {(item.name || 'I').trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'I'}
                  </Text>
                </View>)}
            </View>
            <View className="min-h-[58px] justify-center">
              <Text numberOfLines={2} ellipsizeMode="tail" className={`text-center text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.name}</Text>
            </View>
            <Text numberOfLines={1} ellipsizeMode="tail" className="w-full text-center text-[11px] font-bold text-brand">{item.location}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className={`w-full text-center text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.type}</Text>
          </AnimatedPressable>))}
      </ScrollView>

      <View className={`gap-2 rounded-[24px] border p-[18px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
        <Text className={`text-[14px] font-black uppercase tracking-[0.5px] ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Quick Actions</Text>
        {[
            { label: 'View Subscription Plans', path: '/(drawer)/subscription', icon: 'sparkles-outline', iconTone: palette.secondary },
            { label: 'Your Test History', path: '/(drawer)/(tabs)/profile', icon: 'time-outline', iconTone: palette.blue },
        ].map((item) => (<AnimatedPressable key={item.label} className="flex-row items-center justify-between py-2" onPress={() => router.push(item.path)}>
            <View className="flex-1 flex-row items-center gap-3">
              <View className={`h-[34px] w-[34px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f4eeea]'}`}>
                <Ionicons name={item.icon} size={17} color={item.iconTone}/>
              </View>
              <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.muted}/>
          </AnimatedPressable>))}
      </View>
      {lockedModule ? (<UnlockBottomSheet title={`Unlock ${lockedModule.title}`} subtitle={lockedModule.message} onClose={() => setLockedModule(null)} onPress={() => {
                const returnTarget = lockedModule.moduleId
                    ? {
                        pathname: lockedModule.route,
                        params: {
                            moduleId: String(lockedModule.moduleId),
                        },
                    }
                    : {
                        pathname: lockedModule.route,
                    };
                setLockedModule(null);
                openSubscriptionPrompt(returnTarget);
            }}/>) : null}
    </Screen>);
}

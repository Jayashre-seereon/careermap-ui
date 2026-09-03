import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useAppState } from '../../src/app-state';
import { createStudyAbroadConsultation, getStudyAbroadCountries } from '../../src/api/studyabroadApi';
import { checkModuleAccess, getModules } from '../../src/api/moduleAccessApi';
import { palette } from '../../src/careermap-data';
import { AnimatedPressable, Screen, SectionHeader, UnlockBottomSheet } from '../../src/careermap-ui';
import { openSubscriptionPrompt } from '../../src/subscription-flow';
export default function AbroadScreen() {
    const params = useLocalSearchParams();
    const { width } = useWindowDimensions();
    const { isUnlocked, preferences } = useAppState();
    const unlocked = isUnlocked('abroad-consultancy');
    const autoSubmitHandledRef = useRef('');
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [selected, setSelected] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showUnlockSheet, setShowUnlockSheet] = useState(false);
    const [preferredCountry, setPreferredCountry] = useState('');
    const [courseInterest, setCourseInterest] = useState('');
    const [budgetRange, setBudgetRange] = useState('');
    const [preferredIntake, setPreferredIntake] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [moduleStatus, setModuleStatus] = useState('locked');
    const [moduleAccessResolved, setModuleAccessResolved] = useState(false);
    const selectedCountry = selected !== null ? countries[selected] : null;
    const UG_PROGRAMS = [
  'BBA', 'B.Com', 'B.Tech / Engineering', 'Computer Science', 'Artificial Intelligence',
  'Data Science', 'Nursing', 'Psychology', 'Architecture', 'Hospitality Management',
  'Media & Communication', 'Biotechnology',
];

const PG_PROGRAMS = [
  'MBA', 'MSc Computer Science', 'MSc Data Science',
  'MSc Engineering', 'MSc Finance', 'MSc Marketing','MSc Artificial Intelligence', 
  'Master of Laws (LLM)','Master of Public Health (MPH)', 'Master of Education (M.Ed.)', 'MSc Cybersecurity', 'MSc Business Analytics',
];
    const selectedStudyAbroadId = selectedCountry?.id ? Number(selectedCountry.id) : null;
    
    const consultationPayload = useMemo(() => {
        if (!selectedStudyAbroadId) {
            return null;
        }

        return {
            studyAbroadId: selectedStudyAbroadId,
            preferredCountry: preferredCountry.trim(),
            courseInterest: courseInterest.trim(),
            budgetRange: budgetRange.trim(),
            preferredIntake: preferredIntake.trim(),
            message: message.trim() || 'I want guidance for scholarship and visa process',
        };
    }, [budgetRange, courseInterest, message, preferredCountry, preferredIntake, selectedStudyAbroadId]);

    const encodedConsultationPayload = useMemo(() => {
        if (!consultationPayload) {
            return undefined;
        }

        return encodeURIComponent(JSON.stringify(consultationPayload));
    }, [consultationPayload]);

    const animationKey = submitted
        ? 'submitted'
        : showForm
            ? `form-${preferredCountry || 'blank'}`
            : selected !== null
                ? `country-${selected}`
                : 'country-list';
    const formReturnTarget = useMemo(() => ({
        pathname: '/(drawer)/abroad',
        params: {
            selected: selected !== null ? String(selected) : undefined,
            showForm: 'true',
            preferredCountry: preferredCountry || undefined,
            autoSubmitAfterReturn: 'true',
            consultationPayload: encodedConsultationPayload,
        },
    }), [encodedConsultationPayload, preferredCountry, selected]);

    const handleSubmitConsultation = useCallback(async () => {
        if (!consultationPayload || !consultationPayload.preferredCountry || !consultationPayload.courseInterest || !consultationPayload.budgetRange ) {
            setSubmitError('Please complete all fields before submitting.');
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError('');
            const createdConsultation = await createStudyAbroadConsultation(consultationPayload);

            if (createdConsultation) {
                setSubmitted(true);
            }
            else {
                setSubmitError('Unable to submit consultation right now. Please try again.');
            }
        }
        catch (_error) {
            setSubmitError('Unable to submit consultation right now. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    }, [consultationPayload]);
    useEffect(() => {
        let isMounted = true;

        async function loadCountries() {
            try {
                setIsLoading(true);
                setLoadError('');
                const items = await getStudyAbroadCountries();

                if (isMounted) {
                    setCountries(items);
                }
            }
            catch (_error) {
                if (isMounted) {
                    setCountries([]);
                    setLoadError('Failed to load study abroad destinations.');
                }
            }
            finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadCountries();

        return () => {
            isMounted = false;
        };
    }, []);
    useEffect(() => {
        let isMounted = true;

        async function loadModuleAccess() {
            try {
                const modules = await getModules();
                const matchedModule = modules.find((module) => String(module?.title || '').trim().toLowerCase().includes('study abroad'));
                const moduleId = Number(matchedModule?.id);

                if (!Number.isFinite(moduleId)) {
                    if (isMounted) {
                        setModuleStatus('preview');
                        setModuleAccessResolved(true);
                    }
                    return;
                }

                const response = await checkModuleAccess(moduleId);
                if (!isMounted) {
                    return;
                }

                setModuleStatus(String(response?.mode || 'locked').toLowerCase());
                setModuleAccessResolved(true);
            }
            catch {
                if (isMounted) {
                    setModuleStatus('preview');
                    setModuleAccessResolved(true);
                }
            }
        }

        loadModuleAccess();

        return () => {
            isMounted = false;
        };
    }, []);
    useEffect(() => {
        if (typeof params.selected === 'string') {
            setSelected(Number(params.selected));
        }
        setShowForm(params.showForm === 'true');
        if (typeof params.preferredCountry === 'string') {
            setPreferredCountry(params.preferredCountry);
        }

        if (typeof params.consultationPayload === 'string') {
            try {
                const decodedPayload = JSON.parse(decodeURIComponent(params.consultationPayload));

                if (decodedPayload?.courseInterest) {
                    setCourseInterest(String(decodedPayload.courseInterest));
                }

                if (decodedPayload?.budgetRange) {
                    setBudgetRange(String(decodedPayload.budgetRange));
                }

                if (decodedPayload?.preferredIntake) {
                    setPreferredIntake(String(decodedPayload.preferredIntake));
                }

                if (decodedPayload?.message) {
                    setMessage(String(decodedPayload.message));
                }

                if (decodedPayload?.preferredCountry) {
                    setPreferredCountry(String(decodedPayload.preferredCountry));
                }
            }
            catch {
                // Ignore malformed return payloads and keep the user's current inputs.
            }
        }
    }, [params.consultationPayload, params.preferredCountry, params.selected, params.showForm]);

    useEffect(() => {
        const shouldAutoSubmit = params.autoSubmitAfterReturn === 'true' && params.consultationPayload;

        if (!shouldAutoSubmit || !unlocked || submitted || isSubmitting || !consultationPayload) {
            return;
        }

        const autoSubmitKey = `${params.autoSubmitAfterReturn}:${params.consultationPayload}`;
        if (autoSubmitHandledRef.current === autoSubmitKey) {
            return;
        }

        autoSubmitHandledRef.current = autoSubmitKey;
        void handleSubmitConsultation();
    }, [consultationPayload, handleSubmitConsultation, isSubmitting, params.autoSubmitAfterReturn, params.consultationPayload, submitted, unlocked]);

    if (selected !== null && !selectedCountry) {
        return (<Screen animationKey={animationKey}>
        <SectionHeader title="Study Abroad" subtitle="Loading destination details..." action={<Pressable className={`h-[38px] w-[38px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => {
                    setSelected(null);
                }}>
              <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
            </Pressable>}/>
        <View className={`gap-3 rounded-[26px] border p-[22px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
          <Text className={`text-[18px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Loading study abroad details...</Text>
          <Text className={`text-[14px] leading-[22px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>We are fetching the latest country data from the API.</Text>
        </View>
      </Screen>);
    }
    if (submitted) {
        return (<Screen animationKey={animationKey}>
        <SectionHeader title="Submitted Successfully" subtitle="Your study abroad consultation request has been completed." action={<Pressable className={`h-[38px] w-[38px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => {
                    setSubmitted(false);
                    setShowForm(false);
                    setPreferredCountry('');
                    setCourseInterest('');
                    setBudgetRange('');
                    setPreferredIntake('');
                    setMessage('');
                    setSubmitError('');
                }}>
              <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
            </Pressable>}/>
        <View className={`items-center gap-4 rounded-[26px] border p-[22px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
          <View
            className="h-[92px] w-[92px] items-center justify-center rounded-full"
            style={{ backgroundColor: `${palette.green}14` }}
          >
            <Ionicons name="checkmark" size={44} color={palette.green} />
          </View>
          <View className="items-center gap-2">
            <Text className={`text-center text-[24px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Submitted successfully</Text>
            <Text className={`text-center text-[14px] leading-[22px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
              Your study abroad consultation request has been recorded. We will help you shortlist countries, courses, and scholarship options.
            </Text>
          </View>
          <AnimatedPressable className="rounded-[16px] bg-brand py-[14px] px-[16px]" onPress={() => {
                setSubmitted(false);
                setShowForm(false);
                setPreferredCountry('');
                setCourseInterest('');
                setBudgetRange('');
                setPreferredIntake('');
                setMessage('');
                setSubmitError('');
            }}>
            <Text className="text-center text-[14px] font-extrabold text-white">Done</Text>
          </AnimatedPressable>
        </View>
        </Screen>);
    }
    if (showForm) {
        return (<Screen animationKey={animationKey}>
        <SectionHeader title="Get Free Consultation" subtitle="Tell us about your study plans." action={<Pressable className={`h-[38px] w-[38px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => setShowForm(false)}>
              <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
            </Pressable>}/>
        <View className={`gap-[14px] rounded-[24px] border p-[18px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
          {[
                 ['Course Interest', courseInterest, setCourseInterest, 'e.g. MS in Computer Science'],
                ['Budget Range', budgetRange, setBudgetRange, 'e.g. 20-30 LPA'],
                ['Preferred Country', preferredCountry, setPreferredCountry, 'e.g. USA, UK, Canada'],
                 ['Preferred Intake', preferredIntake, setPreferredIntake, 'e.g. January 2027'],
               ['Message', message, setMessage, 'I want guidance for scholarship and visa process'],
            ].map(([label, value, setter, placeholder]) => (<View key={label} className="gap-1.5">
              <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{label}</Text>
              <TextInput value={value} onChangeText={setter} placeholder={placeholder} placeholderTextColor={preferences.darkMode ? '#7f7481' : palette.muted} className={`rounded-[16px] border px-4 py-[14px] text-[13px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111] text-white' : 'border-line bg-surface text-ink'}`}/>
            </View>))}
          {submitError ? (<Text className="text-[13px] font-semibold text-brand">{submitError}</Text>) : null}
          <AnimatedPressable className="rounded-[16px] bg-brand py-[14px]"
          onPress={handleSubmitConsultation} disabled={isSubmitting}>
            <Text className="text-center text-[14px] font-extrabold text-white"> {isSubmitting ? 'Submitting...' : 'Submit Request'}</Text>
          </AnimatedPressable>
        </View>
      </Screen>);
    }
    if (selected !== null) {
        const country = selectedCountry;
        return (<Screen animationKey={animationKey}>
        <SectionHeader title={country.title}  action={<Pressable className={`h-[38px] w-[38px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => {
                    setSelected(null);
                }}>
              <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
            </Pressable>}/>
        {!unlocked ? (<View className="self-start rounded-full px-3 py-2" style={{ backgroundColor: `${palette.orange}12` }}>
            <Text className="text-[11px] font-extrabold" style={{ color: palette.orange }}>
              Subscribe to unlock more country details
            </Text>
          </View>) : null}
        <View className="relative">
          <>
            <View className="items-center gap-2 py-1.5">
              <View className="h-[72px] w-[72px] items-center justify-center rounded-[24px]" style={{ backgroundColor: `${palette.primary}10` }}>
               <Ionicons name="globe-outline" size={28} color={palette.primary}/>
        </View>
              </View>

            <View className={`gap-3 rounded-[26px] border p-[22px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
              <Text className="text-[15px] font-extrabold text-brand">Description</Text>
             <View>
  {country.description
    .replace(/&nbsp;/g, ' ')
    .split(/(<h3[\s\S]*?<\/h3>|<p[\s\S]*?<\/p>)/gi)
    .filter(Boolean)
    .map((part, index) => {
      const isHeading = /<h3/i.test(part);

      const text = part
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();

      if (!text) return null;

      return (
        <Text
          key={index}
          className={
            isHeading
              ? `mt-3 text-[17px] font-black ${
                  preferences.darkMode
                    ? 'text-white'
                    : 'text-ink'
                }`
              : `text-[14px] leading-[24px] ${
                  preferences.darkMode
                    ? 'text-[#b7aeb9]'
                    : 'text-muted'
                }`
          }
        >
          {text}
        </Text>
      );
    })}
</View> 
              
            </View>

          

            <AnimatedPressable className="rounded-[16px] bg-brand py-[14px] mt-3" onPress={() => {
                    setPreferredCountry(country.countryName);
                    setShowForm(true);
                }}>
              <Text className="text-center text-[14px]  font-extrabold text-white">Consult Now</Text>
            </AnimatedPressable>
          </>
        </View>
      </Screen>);
    }
    return (<Screen animationKey={animationKey}>
      <SectionHeader title="Study Abroad" subtitle="Explore world-class education opportunities in the world's leading study destinations. We help students secure admission to top-ranked universities offering Undergraduate (UG) and Postgraduate (PG) programs across the UK, USA, Canada, Europe, Singapore, and Dubai.
"/>
<View className="gap-3">
  <View className={`gap-3 rounded-[24px] border p-[18px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
    <View className="flex-row items-center gap-2">
      <View className="h-9 w-9 items-center justify-center rounded-[12px]" style={{ backgroundColor: `${palette.primary}12` }}>
        <Ionicons name="school-outline" size={18} color={palette.primary} />
      </View>
      <Text className={`text-[15px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
        Popular Undergraduate (UG) Programs
      </Text>
    </View>
    <View className="flex-row flex-wrap gap-2">
      {UG_PROGRAMS.map((program) => (
        <View key={program} className={`rounded-full border px-3 py-2 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111]' : 'border-line bg-surface'}`}>
          <Text className={`text-[12px] font-bold ${preferences.darkMode ? 'text-[#e5dfe6]' : 'text-ink'}`}>{program}</Text>
        </View>
      ))}
    </View>
  </View>

  <View className={`gap-3 rounded-[24px] border p-[18px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
    <View className="flex-row items-center gap-2">
      <View className="h-9 w-9 items-center justify-center rounded-[12px]" style={{ backgroundColor: `${palette.teal}12` }}>
        <Ionicons name="ribbon-outline" size={18} color={palette.teal} />
      </View>
      <Text className={`text-[15px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
        Popular Postgraduate (PG) Programs
      </Text>
    </View>
    <View className="flex-row flex-wrap gap-2">
      {PG_PROGRAMS.map((program) => (
        <View key={program} className={`rounded-full border px-3 py-2 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111]' : 'border-line bg-surface'}`}>
          <Text className={`text-[12px] font-bold ${preferences.darkMode ? 'text-[#e5dfe6]' : 'text-ink'}`}>{program}</Text>
        </View>
      ))}
    </View>
  </View>
</View>
      
      {!moduleAccessResolved ? (<Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Checking access...</Text>) : null}
      {isLoading ? (<Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading destinations...</Text>) : null}
      {!isLoading && loadError ? (<Text className="text-[13px] text-brand">{loadError}</Text>) : null}
      <View className="gap-3">
        {countries.map((country, index) => {
            const detailOpen = moduleStatus === 'full' || (moduleStatus === 'preview' && index < 4);
            const cardPadding = width < 420 ? 'p-[16px]' : 'p-[18px]';
            return (<Pressable key={country.id} className={`relative gap-1.5 rounded-[22px] border ${cardPadding} ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} 
             onPress={() => {
  if (!detailOpen) {
    setShowUnlockSheet(true);
    return;
  }
  setSelected(index);
}}>
            <View className={`absolute right-4 top-4 h-6 w-6 items-center justify-center rounded-full ${detailOpen ? 'bg-[#e4f7ed]' : 'bg-[#fdecea]'}`}>
                <Ionicons
                    name={detailOpen ? 'lock-open' : 'lock-closed'}
                    size={13}
                    color={detailOpen ? '#2f9367' : '#e53935'}
                />
            </View>
            {width < 520 ? (<View className="gap-3 pt-1">
                <View className="flex-row items-start gap-3 pr-10">
                  <View className="h-11 w-11 items-center justify-center rounded-[14px]" style={{ backgroundColor: `${palette.teal}10` }}>
                 <Ionicons name="globe-outline" size={28} color={palette.teal}/>
         </View>
                  <View className="min-w-0 flex-1 gap-1 pr-2">
                    <Text numberOfLines={2} className={`text-[15px] font-extrabold leading-5 ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{country.title}</Text>
                   </View>
                </View>
              </View>) : (<View className="flex-row items-start gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-[14px]" style={{ backgroundColor: `${palette.primary}10` }}>
                  <Text className="text-[11px] font-black text-brand">{country.countryName.slice(0, 3).toUpperCase()}</Text>
                </View>
                <View className="min-w-0 flex-1 gap-1 pr-2">
                  <Text numberOfLines={2} className={`text-[16px] font-extrabold leading-5 ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{country.title}</Text>
                    </View>
                <View className="items-end gap-2" />
              </View>)}
          </Pressable>);
        })}
      </View>
      {showUnlockSheet ? (<UnlockBottomSheet title="Unlock Study Abroad" subtitle="Subscribe to more country details, scholarships, visa guidance, and counselling access." onClose={() => setShowUnlockSheet(false)} onPress={() => {
                setShowUnlockSheet(false);
                openSubscriptionPrompt(showForm ? formReturnTarget : { pathname: '/(drawer)/abroad' });
            }}/>) : null}
    </Screen>);
}

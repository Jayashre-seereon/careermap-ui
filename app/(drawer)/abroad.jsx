import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useAppState } from '../../src/app-state';
import { createStudyAbroadConsultation, getStudyAbroadCountries } from '../../src/api/studyabroadApi';
import { palette } from '../../src/careermap-data';
import { AnimatedPressable, Screen, SectionHeader, UnlockBottomSheet } from '../../src/careermap-ui';
import { openSubscriptionPrompt } from '../../src/subscription-flow';
export default function AbroadScreen() {
    const params = useLocalSearchParams();
    const { width } = useWindowDimensions();
    const { canAccessFreeDetail, isUnlocked, preferences, registerFreeDetailAccess } = useAppState();
    const unlocked = isUnlocked('abroad-consultancy');
    const autoSubmitHandledRef = useRef('');
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [selected, setSelected] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    //const [showUnlockSheet, setShowUnlockSheet] = useState(false);
    const [preferredCountry, setPreferredCountry] = useState('');
    const [courseInterest, setCourseInterest] = useState('');
    const [budgetRange, setBudgetRange] = useState('');
    const [preferredIntake, setPreferredIntake] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const selectedCountry = selected !== null ? countries[selected] : null;
   // const detailUnlocked = selectedCountry ? canAccessFreeDetail('abroad-consultancy', selectedCountry.countryName) : true;
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
        if (!consultationPayload || !consultationPayload.preferredCountry || !consultationPayload.courseInterest || !consultationPayload.budgetRange || !consultationPayload.preferredIntake) {
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
        <SectionHeader title="Consultation Form" subtitle="A lightweight consultancy form matching the prototype structure." action={<Pressable className={`h-[38px] w-[38px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => setShowForm(false)}>
              <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
            </Pressable>}/>
        <View className={`gap-[14px] rounded-[24px] border p-[18px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
          {[
                ['Preferred Country', preferredCountry, setPreferredCountry, 'e.g. USA, UK, Canada'],
                ['Course Interest', courseInterest, setCourseInterest, 'e.g. MS in Computer Science'],
                ['Budget Range', budgetRange, setBudgetRange, 'e.g. 20-30 LPA'],
                ['Preferred Intake', preferredIntake, setPreferredIntake, 'e.g. Fall 2025'],
                ['Message', message, setMessage, 'I want guidance for scholarship and visa process'],
            ].map(([label, value, setter, placeholder]) => (<View key={label} className="gap-1.5">
              <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{label}</Text>
              <TextInput value={value} onChangeText={setter} placeholder={placeholder} placeholderTextColor={preferences.darkMode ? '#7f7481' : palette.muted} className={`rounded-[16px] border px-4 py-[14px] text-[13px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111] text-white' : 'border-line bg-surface text-ink'}`}/>
            </View>))}
          {submitError ? (<Text className="text-[13px] font-semibold text-brand">{submitError}</Text>) : null}
          <AnimatedPressable className="rounded-[16px] bg-brand py-[14px]" onPress={() => (unlocked ? handleSubmitConsultation() : openSubscriptionPrompt(formReturnTarget))} disabled={isSubmitting}>
            <Text className="text-center text-[14px] font-extrabold text-white">{isSubmitting ? 'Submitting...' : unlocked ? 'Submit Request' : 'Subscribe to Submit'}</Text>
          </AnimatedPressable>
        </View>
      </Screen>);
    }
    if (selected !== null) {
        const country = selectedCountry;
        return (<Screen animationKey={animationKey}>
        <SectionHeader title={country.title} subtitle="Expanded country detail page adapted from the reference prototype." action={<Pressable className={`h-[38px] w-[38px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => {
                    setSelected(null);
                }}>
              <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
            </Pressable>}/>
        {/* {!unlocked ? (<View className="self-start rounded-full px-3 py-2" style={{ backgroundColor: `${detailUnlocked ? palette.green : palette.orange}12` }}>
            <Text className="text-[11px] font-extrabold" style={{ color: detailUnlocked ? palette.green : palette.orange }}>
              {detailUnlocked ? '1 free country detail unlocked' : 'Subscribe to unlock more country details'}
            </Text>
          </View>) : null} */}
        <View className="relative">
          <>
            <View className="items-center gap-2 py-1.5">
              <View className="h-[72px] w-[72px] items-center justify-center rounded-[24px]" style={{ backgroundColor: `${palette.primary}10` }}>
                <Text className="text-center text-[18px] font-black text-brand">{country.countryName.slice(0, 3).toUpperCase()}</Text>
              </View>
               <Text className={`text-center text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{country.description}</Text>
            </View>

            <View className={`gap-3 rounded-[26px] border p-[22px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
              <Text className="text-[15px] font-extrabold text-brand">Overview</Text>
              <Text className={`text-[14px] leading-[22px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{country.overview}</Text>
              <View className="flex-row gap-2.5">
                <View className={`flex-1 gap-1 rounded-[18px] p-4 ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f8f4ff]'}`}>
                  <Ionicons name="cash-outline" size={18} color={palette.green}/>
                  <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Tuition Cost</Text>
                  <Text className="text-[16px] font-extrabold" style={{ color: palette.purple }}>{country.tuitionCost}</Text>
                </View>
                <View className={`flex-1 gap-1 rounded-[18px] p-4 ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f8f4ff]'}`}>
                  <Ionicons name="school-outline" size={18} color={palette.blue}/>
                  <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Living Cost</Text>
                  <Text className="text-[16px] font-extrabold" style={{ color: palette.purple }}>{country.livingCost}</Text>
                </View>
              </View>
              
            </View>

            {[
                    ['Visa & Work Rights', [country.visaWork]],
                    ['Top Universities', country.topUniversities.map((item) => `- ${item}`)],
                    ['Scholarships', country.scholarships.map((item) => `- ${item}`)],
                    ['Requirements', country.requirements.map((item) => `- ${item}`)],
                    ['Popular Courses', country.popularCourses.map((item) => `- ${item}`)],
                ].map(([title, lines]) => (<View key={title} className={`mt-3 gap-2.5 rounded-[26px] border p-[22px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
                <Text className="text-[15px] font-extrabold text-brand">{title}</Text>
                {lines.map((line) => (<Text key={line} className={`text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{line}</Text>))}
              </View>))}

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
      <SectionHeader title="Study Abroad" subtitle="Country list and consultancy flow adapted from the prototype."/>
      <View className={`items-center gap-2 rounded-[26px] border p-5 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
        <View className="h-[60px] w-[60px] items-center justify-center rounded-[20px]" style={{ backgroundColor: `${palette.teal}12` }}>
          <Ionicons name="globe-outline" size={28} color={palette.teal}/>
        </View>
        <Text className={`text-[22px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Study Abroad</Text>
        <Text className={`text-center text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Explore top destinations, compare tuition and living cost, and request counselling from the same flow as the git prototype.</Text>
      </View>
      {isLoading ? (<Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading destinations...</Text>) : null}
      {!isLoading && loadError ? (<Text className="text-[13px] text-brand">{loadError}</Text>) : null}
      <View className="gap-3">
        {countries.map((country, index) => {
            const detailOpen = unlocked || canAccessFreeDetail('abroad-consultancy', country.countryName);
            const cardPadding = width < 420 ? 'p-[16px]' : 'p-[18px]';
            return (<Pressable key={country.id} className={`relative gap-1.5 rounded-[22px] border ${cardPadding} ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} 
             onPress={() => {
  setSelected(index);
}}>
            {width < 520 ? (<View className="gap-3 pt-1">
                <View className="flex-row items-start gap-3 pr-10">
                  <View className="h-11 w-11 items-center justify-center rounded-[14px]" style={{ backgroundColor: `${palette.primary}10` }}>
                    <Text className="text-[11px] font-black text-brand">{country.countryName.slice(0, 3).toUpperCase()}</Text>
                  </View>
                  <View className="min-w-0 flex-1 gap-1 pr-2">
                    <Text numberOfLines={2} className={`text-[15px] font-extrabold leading-5 ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{country.title}</Text>
                    <Text numberOfLines={2} className={`text-[12px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{country.description}</Text>
                  </View>
                </View>
                {/* {!unlocked ? (<View className={`absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-full ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f8e8d8]'}`}>
                  <Ionicons name={detailOpen ? 'lock-open-outline' : 'lock-closed'} size={15} color={palette.primary}/>
                </View>) : null} */}
                <View className="flex-row flex-wrap justify-start gap-2 pl-[52px]">
                  <View className="flex-row items-center gap-2 rounded-full px-2.5 py-1.5" style={{ backgroundColor: `${palette.blue}10` }}>
                    <Ionicons name="school-outline" size={14} color={palette.blue}/>
                    <Text className="text-[10px] font-extrabold" style={{ color: palette.blue }}>Tuition</Text>
                    <Text className={`text-[10px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{country.tuitionCost}</Text>
                  </View>
                  <View className="flex-row items-center gap-2 rounded-full px-2.5 py-1.5" style={{ backgroundColor: `${palette.green}10` }}>
                    <Ionicons name="home-outline" size={14} color={palette.green}/>
                    <Text className="text-[10px] font-extrabold" style={{ color: palette.green }}>Living</Text>
                    <Text className={`text-[10px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{country.livingCost}</Text>
                  </View>
                </View>
              </View>) : (<View className="flex-row items-start gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-[14px]" style={{ backgroundColor: `${palette.primary}10` }}>
                  <Text className="text-[11px] font-black text-brand">{country.countryName.slice(0, 3).toUpperCase()}</Text>
                </View>
                <View className="min-w-0 flex-1 gap-1 pr-2">
                  <Text numberOfLines={2} className={`text-[16px] font-extrabold leading-5 ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{country.title}</Text>
                  <Text numberOfLines={2} className={`text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{country.description}</Text>
                </View>
                <View className="items-end gap-2">
                  {/* {!unlocked ? (<View className={`h-8 w-8 items-center justify-center rounded-full ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f8e8d8]'}`}>
                    <Ionicons name={detailOpen ? 'lock-open-outline' : 'lock-closed'} size={15} color={palette.primary}/>
                  </View>) : null} */}
                  <View className="flex-row flex-wrap justify-end gap-2">
                    <View className="flex-row items-center gap-2 rounded-full px-3 py-2" style={{ backgroundColor: `${palette.blue}10` }}>
                      <Ionicons name="school-outline" size={14} color={palette.blue}/>
                      <Text className="text-[11px] font-extrabold" style={{ color: palette.blue }}>Tuition</Text>
                      <Text className={`text-[11px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{country.tuitionCost}</Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full px-3 py-2" style={{ backgroundColor: `${palette.green}10` }}>
                      <Ionicons name="home-outline" size={14} color={palette.green}/>
                      <Text className="text-[11px] font-extrabold" style={{ color: palette.green }}>Living</Text>
                      <Text className={`text-[11px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{country.livingCost}</Text>
                    </View>
                  </View>
                </View>
              </View>)}
          </Pressable>);
        })}
      </View>
      {/* {showUnlockSheet ? (<UnlockBottomSheet title="Unlock Study Abroad" subtitle="Subscribe to more country details, scholarships, visa guidance, and counselling access." onClose={() => setShowUnlockSheet(false)} onPress={() => {
                setShowUnlockSheet(false);
                openSubscriptionPrompt(showForm ? formReturnTarget : { pathname: '/(drawer)/abroad' });
            }}/>) : null} */}
    </Screen>);
}

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { palette, studyAbroadCountries } from '../../src/careermap-data';
import { AnimatedPressable, Pill, Screen, SectionHeader, UnlockBottomSheet } from '../../src/careermap-ui';
import { openSubscriptionPrompt } from '../../src/subscription-flow';
export default function AbroadScreen() {
    const params = useLocalSearchParams();
    const { canAccessFreeDetail, isUnlocked, preferences, registerFreeDetailAccess } = useAppState();
    const unlocked = isUnlocked('abroad-consultancy');
    const [selected, setSelected] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showUnlockSheet, setShowUnlockSheet] = useState(false);
    const [preferredCountry, setPreferredCountry] = useState('');
    const [courseInterest, setCourseInterest] = useState('');
    const [budgetRange, setBudgetRange] = useState('');
    const [preferredIntake, setPreferredIntake] = useState('');
    const animationKey = submitted
        ? 'submitted'
        : showForm
            ? `form-${preferredCountry || 'blank'}`
            : selected !== null
                ? `country-${selected}`
                : 'country-list';
    const selectedCountry = selected !== null ? studyAbroadCountries[selected] : null;
    const detailUnlocked = selectedCountry ? canAccessFreeDetail('abroad-consultancy', selectedCountry.name) : true;
    const formReturnTarget = useMemo(() => ({
        pathname: '/(drawer)/abroad',
        params: { selected: selected !== null ? String(selected) : undefined, showForm: 'true', preferredCountry: preferredCountry || undefined },
    }), [preferredCountry, selected]);
    useEffect(() => {
        if (typeof params.selected === 'string') {
            setSelected(Number(params.selected));
        }
        setShowForm(params.showForm === 'true');
        if (typeof params.preferredCountry === 'string') {
            setPreferredCountry(params.preferredCountry);
        }
    }, [params.preferredCountry, params.selected, params.showForm]);
    if (submitted) {
        return (<Screen animationKey={animationKey}>
        <SectionHeader title="Request Sent" subtitle="Consultation request state added to match the prototype flow." action={<Pressable className={`h-[38px] w-[38px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => {
                    setSubmitted(false);
                    setShowForm(false);
                    setPreferredCountry('');
                    setCourseInterest('');
                    setBudgetRange('');
                    setPreferredIntake('');
                }}>
              <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
            </Pressable>}/>
        <View className={`gap-3 rounded-[26px] border p-[22px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
          <Text className={`text-[24px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Our team will contact you shortly</Text>
          <Text className={`text-[14px] leading-[22px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
            Your study abroad consultation request has been recorded. We will help you shortlist countries, courses, and scholarship options.
          </Text>
          <AnimatedPressable className="rounded-[16px] bg-brand py-[14px]" onPress={() => {
                setSubmitted(false);
                setShowForm(false);
                setPreferredCountry('');
                setCourseInterest('');
                setBudgetRange('');
                setPreferredIntake('');
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
            ].map(([label, value, setter, placeholder]) => (<View key={label} className="gap-1.5">
              <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{label}</Text>
              <TextInput value={value} onChangeText={setter} placeholder={placeholder} placeholderTextColor={preferences.darkMode ? '#7f7481' : palette.muted} className={`rounded-[16px] border px-4 py-[14px] text-[13px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111] text-white' : 'border-line bg-surface text-ink'}`}/>
            </View>))}
          <AnimatedPressable className="rounded-[16px] bg-brand py-[14px]" onPress={() => (unlocked ? setSubmitted(true) : openSubscriptionPrompt(formReturnTarget))}>
            <Text className="text-center text-[14px] font-extrabold text-white">{unlocked ? 'Submit Request' : 'Subscribe to Submit'}</Text>
          </AnimatedPressable>
        </View>
      </Screen>);
    }
    if (selected !== null) {
        const country = studyAbroadCountries[selected];
        return (<Screen animationKey={animationKey}>
        <SectionHeader title={country.name} subtitle="Expanded country detail page adapted from the reference prototype." action={<Pressable className={`h-[38px] w-[38px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => {
                    setSelected(null);
                }}>
              <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
            </Pressable>}/>
        {!unlocked ? (<View className="self-start rounded-full px-3 py-2" style={{ backgroundColor: `${detailUnlocked ? palette.green : palette.orange}12` }}>
            <Text className="text-[11px] font-extrabold" style={{ color: detailUnlocked ? palette.green : palette.orange }}>
              {detailUnlocked ? '1 free country detail unlocked' : 'Subscribe to unlock more country details'}
            </Text>
          </View>) : null}
        <View className="relative">
          <>
            <View className="items-center gap-2 py-1.5">
              <View className="h-[72px] w-[72px] items-center justify-center rounded-[24px]" style={{ backgroundColor: `${palette.primary}10` }}>
                <Text className="text-[18px] font-black text-brand">{country.flag}</Text>
              </View>
               <Text className={`text-center text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{country.description}</Text>
            </View>

            <View className={`gap-3 rounded-[26px] border p-[22px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
              <Text className="text-[15px] font-extrabold text-brand">Overview</Text>
              <Text className={`text-[14px] leading-[22px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{country.detail}</Text>
              <View className="flex-row gap-2.5">
                <View className={`flex-1 gap-1 rounded-[18px] p-4 ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f8f4ff]'}`}>
                  <Ionicons name="cash-outline" size={18} color={palette.green}/>
                  <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Tuition</Text>
                  <Text className="text-[16px] font-extrabold" style={{ color: palette.purple }}>{country.tuition}</Text>
                </View>
                <View className={`flex-1 gap-1 rounded-[18px] p-4 ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f8f4ff]'}`}>
                  <Ionicons name="school-outline" size={18} color={palette.blue}/>
                  <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Living Cost</Text>
                  <Text className="text-[16px] font-extrabold" style={{ color: palette.purple }}>{country.living}</Text>
                </View>
              </View>
              <View className="flex-row flex-wrap gap-2">
                <Pill label={country.visa} tone={palette.blue}/>
                <Pill label={country.intake} tone={palette.green}/>
              </View>
            </View>

            {[
                    ['Visa & Work Rights', [`Visa: ${country.visa}`, `Intakes: ${country.intake}`, `Work: ${country.workRights}`]],
                    ['Top Universities', country.topUniversities.map((item) => `- ${item}`)],
                    ['Scholarships', country.scholarships.map((item) => `- ${item}`)],
                    ['Requirements', country.requirements.map((item) => `- ${item}`)],
                ].map(([title, lines]) => (<View key={title} className={`mt-3 gap-2.5 rounded-[26px] border p-[22px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
                <Text className="text-[15px] font-extrabold text-brand">{title}</Text>
                {lines.map((line) => (<Text key={line} className={`text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{line}</Text>))}
              </View>))}

            <View className={`mt-3 gap-2.5 rounded-[26px] border p-[22px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
              <Text className="text-[15px] font-extrabold text-brand">Popular Courses</Text>
              <View className="flex-row flex-wrap gap-2">
                {country.popularCourses.map((course) => (<Pill key={course} label={course} tone={palette.primary}/>))}
              </View>
            </View>

            <AnimatedPressable className="rounded-[16px] bg-brand py-[14px] mt-3" onPress={() => {
                    setPreferredCountry(country.name);
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
      <View className="gap-3">
        {studyAbroadCountries.map((country, index) => (<Pressable key={country.name} className={`gap-1.5 rounded-[22px] border p-[18px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} onPress={() => {
                if (!unlocked && !canAccessFreeDetail('abroad-consultancy', country.name)) {
                    setShowUnlockSheet(true);
                    return;
                }
                registerFreeDetailAccess('abroad-consultancy', country.name);
                setSelected(index);
            }}>
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-[14px]" style={{ backgroundColor: `${palette.primary}10` }}>
                <Text className="text-[11px] font-black text-brand">{country.flag}</Text>
              </View>
              <View className="flex-1 gap-1">
                <Text className={`text-[16px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{country.name}</Text>
                <Text className={`text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{country.description}</Text>
                <Text className="text-[12px] font-extrabold text-brand">{country.tuition}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={preferences.darkMode ? '#b7aeb9' : palette.muted}/>
            </View>
          </Pressable>))}
      </View>
      <AnimatedPressable className="rounded-[16px] bg-brand py-[14px]" onPress={() => (unlocked ? setShowForm(true) : setShowUnlockSheet(true))}>
        <Text className="text-center text-[14px] font-extrabold text-white">Consult Now</Text>
      </AnimatedPressable>
      {showUnlockSheet ? (<UnlockBottomSheet title="Unlock Study Abroad" subtitle="Subscribe to more country details, scholarships, visa guidance, and counselling access." onClose={() => setShowUnlockSheet(false)} onPress={() => {
                setShowUnlockSheet(false);
                openSubscriptionPrompt(showForm ? formReturnTarget : { pathname: '/(drawer)/abroad' });
            }}/>) : null}
    </Screen>);
}

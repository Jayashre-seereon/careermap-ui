import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/app-state';
import { palette } from '../src/careermap-data';
import { AnimatedPressable } from '../src/careermap-ui';
import { AnimatedBackground } from '../src/animated-background';
import { ZoomInPage } from '../src/page-transition';
const selectionMeta = [
    { key: 'selectedClass', label: 'Class', icon: 'school-outline', color: palette.blue },
    { key: 'selectedStream', label: 'Stream', icon: 'layers-outline', color: palette.purple },
    { key: 'selectedClarity', label: 'Career Clarity', icon: 'compass-outline', color: palette.orange },
    { key: 'selectedGuidance', label: 'Guidance', icon: 'chatbubble-ellipses-outline', color: palette.green },
];
export default function ProfileSetupScreen() {
    const { onboarding, preferences, saveOnboarding, saveUserProfile, showPromoMessage, userProfile } = useAppState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: onboarding.userType === 'parent' ? onboarding.name : onboarding.name,
        email: userProfile.email,
        mobile: userProfile.mobile,
        password: userProfile.password,
        address: userProfile.address,
        gender: userProfile.gender,
        dob: userProfile.dob,
        city: userProfile.city,
        stateName: userProfile.stateName,
    });
    const [showPassword, setShowPassword] = useState(false);
    const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const isValid = form.name && form.email && form.mobile && form.password;
    const onboardingChips = useMemo(() => [
        ...selectionMeta
            .map((item) => ({
            ...item,
            value: onboarding[item.key],
        }))
            .filter((item) => Boolean(item.value)),
        ...onboarding.selectedInterests.map((item) => ({ label: item, icon: 'sparkles-outline', color: palette.primary })),
        ...onboarding.selectedStrengths.map((item) => ({ label: item, icon: 'flash-outline', color: palette.teal })),
        ...onboarding.selectedPriorities.map((item) => ({ label: item, icon: 'flag-outline', color: palette.secondary })),
    ], [onboarding]);
    const hasOnboardingSelections = onboarding.selectedClass ||
        onboarding.selectedStream ||
        onboarding.selectedClarity ||
        onboarding.selectedGuidance ||
        onboarding.selectedInterests.length > 0 ||
        onboarding.selectedStrengths.length > 0 ||
        onboarding.selectedPriorities.length > 0;
    return (<SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}> 
          <AnimatedBackground />  
            <ZoomInPage style={{ flex: 1 }}>
            <ScrollView className="flex-1" contentContainerClassName="gap-[14px] px-6 py-6" showsVerticalScrollIndicator={false}>
        <AnimatedPressable className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
        </AnimatedPressable>
        <View className="mb-2 items-center gap-2">
          <View className="h-[68px] w-[68px] items-center justify-center rounded-[22px] bg-brand">
            <Ionicons name="person-circle-outline" size={34} color="#fff"/>
          </View>
          <Text className={`text-center text-[28px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Complete Your Profile</Text>
          <Text className={`text-center text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Help us serve you better</Text>
        </View>

        {hasOnboardingSelections ? (<View className={`gap-[14px] rounded-[22px] border p-[18px] ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
            <View className="flex-row items-center gap-3">
              <View className="h-[38px] w-[38px] items-center justify-center rounded-[14px]" style={{ backgroundColor: `${palette.primary}10` }}>
                <Ionicons name="checkmark-done-circle-outline" size={18} color={palette.primary}/>
              </View>
              <View className="flex-1 gap-0.5">
                <Text className={`text-[15px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Your Onboarding Selections</Text>
                <Text className={`text-[12px] leading-[18px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>We carried these choices over from onboarding.</Text>
              </View>
            </View>

            {onboarding.userType ? (<View className="flex-row flex-wrap gap-2.5">
                <View className={`flex-row items-center gap-1.5 rounded-full px-3 py-2 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-paper'}`}>
                  <Ionicons name={onboarding.userType === 'parent' ? 'people-outline' : 'person-outline'} size={14} color={palette.primary}/>
                  <Text className="text-[12px] font-extrabold text-brand">{onboarding.userType === 'parent' ? 'Parent Journey' : 'Student Journey'}</Text>
                </View>
                {onboarding.childName ? (<View className={`flex-row items-center gap-1.5 rounded-full px-3 py-2 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-paper'}`}>
                    <Ionicons name="heart-outline" size={14} color={palette.orange}/>
                    <Text className="text-[12px] font-extrabold" style={{ color: palette.orange }}>{onboarding.childName}</Text>
                  </View>) : null}
              </View>) : null}

            <View className="flex-row flex-wrap gap-2.5">
              {onboardingChips.map((item) => (<View key={`${item.label}-${item.icon}`} className={`flex-row items-center gap-[7px] rounded-full px-3 py-[9px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-paper'}`}>
                  <Ionicons name={item.icon} size={14} color={item.color}/>
                  <Text className={`text-[12px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.label}</Text>
                </View>))}
            </View>
          </View>) : null}

        {[
            ['name', onboarding.userType === 'parent' ? 'Parent Name' : 'Full Name', 'Enter your full name', 'person-outline'],
            ['email', 'Email Address', 'Enter email', 'mail-outline'],
            ['mobile', 'Mobile Number', '+91 XXXXX XXXXX', 'call-outline'],
            ['password', 'Password', 'Create password', 'lock-closed-outline'],
            ['address', 'Address', 'Enter your address', 'location-outline'],
            ['city', 'City', 'Enter city', 'business-outline'],
            ['stateName', 'State', 'Enter state', 'map-outline'],
        ].map(([key, label, placeholder, icon]) => (<View key={key} className="gap-1.5">
            <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{label}</Text>
            <View className={`h-14 flex-row items-center gap-2.5 rounded-[18px] border px-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
              <Ionicons name={icon} size={18} color={palette.muted}/>
              <TextInput value={form[key]} onChangeText={(value) => update(key, value)} placeholder={placeholder} placeholderTextColor={palette.muted} secureTextEntry={key === 'password' ? !showPassword : false} className={`flex-1 text-[15px] ${preferences.darkMode ? 'text-white' : 'text-ink'}`}/>
              {key === 'password' ? (<AnimatedPressable onPress={() => setShowPassword((value) => !value)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={palette.muted}/>
                </AnimatedPressable>) : null}
            </View>
          </View>))}

        <View className="gap-1.5">
          <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Gender</Text>
          <View className="flex-row gap-2.5">
            {[
            { label: 'Male', icon: 'male-outline' },
            { label: 'Female', icon: 'female-outline' },
            { label: 'Other', icon: 'transgender-outline' },
        ].map((gender) => (<AnimatedPressable key={gender.label} onPress={() => update('gender', gender.label)} className={`h-12 flex-1 px-3 py-2 flex-row items-center justify-center gap-1.5 rounded-[16px] border ${form.gender === gender.label ? 'border-brand bg-brand' : preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
                <Ionicons name={gender.icon} size={16} color={form.gender === gender.label ? '#fff' : palette.muted}/>
                <Text className={`text-[13px] font-extrabold ${form.gender === gender.label ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{gender.label}</Text>
              </AnimatedPressable>))}
          </View>
        </View>

        <View className="gap-1.5">
          <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Date of Birth</Text>
          <View className={`h-14 flex-row items-center gap-2.5 rounded-[18px] border px-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
            <Ionicons name="calendar-outline" size={18} color={palette.muted}/>
            <TextInput value={form.dob} onChangeText={(value) => update('dob', value)} placeholder="YYYY-MM-DD" placeholderTextColor={palette.muted} className={`flex-1 text-[15px] ${preferences.darkMode ? 'text-white' : 'text-ink'}`}/>
          </View>
        </View>

        <AnimatedPressable className="mt-3 items-center rounded-[18px] bg-brand py-4" disabled={!isValid || isSubmitting} onPress={() => {
            setIsSubmitting(true);
            saveOnboarding({ ...onboarding, name: form.name });
            saveUserProfile({
                ...userProfile,
                name: form.name,
                email: form.email,
                mobile: form.mobile,
                password: form.password,
                address: form.address,
                city: form.city,
                stateName: form.stateName,
                gender: form.gender,
                dob: form.dob,
                childName: onboarding.childName,
            });
            showPromoMessage('Profile created successfully.');
            router.replace('/promo');
        }}>
          <Text className="text-[15px] font-extrabold text-white">{isSubmitting ? 'Creating Profile...' : 'Complete Profile'}</Text>
        </AnimatedPressable>
      </ScrollView>
      </ZoomInPage>
    </SafeAreaView>);
}

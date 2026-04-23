import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/app-state';
import { AnimatedBackground } from '../src/animated-background';
import { palette } from '../src/careermap-data';
import { AnimatedPressable } from '../src/careermap-ui';
export default function SignupScreen() {
    const { preferences } = useAppState();
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        city: '',
        state: '',
    });
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });
    const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    return (<SafeAreaView className="flex-1 bg-transparent">
      <AnimatedBackground />
      <ScrollView className="flex-1" contentContainerClassName="gap-[14px] px-6 py-6" showsVerticalScrollIndicator={false}>
        <AnimatedPressable onPress={() => router.back()}>
          <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Back</Text>
        </AnimatedPressable>
        <Text className={`text-[30px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Create Account</Text>
        <Text className={`mb-1.5 text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Join Career Map today</Text>

        {[
            ['name', 'Full Name', 'Enter your full name'],
            ['email', 'Email Address', 'Enter email'],
            ['mobile', 'Mobile Number', '+91 XXXXX XXXXX'],
            ['password', 'Password', 'Create password'],
            ['confirmPassword', 'Confirm Password', 'Re-enter password'],
            ['city', 'City', 'Enter city'],
            ['state', 'State', 'Enter state'],
        ].map(([key, label, placeholder]) => (<View key={key} className="gap-1.5">
            <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{label}</Text>
            {key.toLowerCase().includes('password') ? (<View className={`h-14 flex-row items-center gap-2.5 rounded-[18px] border px-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
                <TextInput value={form[key]} onChangeText={(value) => update(key, value)} placeholder={placeholder} placeholderTextColor={palette.muted} className={`flex-1 text-[15px] ${preferences.darkMode ? 'text-white' : 'text-ink'}`} secureTextEntry={!showPassword[key]}/>
                <AnimatedPressable onPress={() => setShowPassword((current) => ({ ...current, [key]: !current[key] }))}>
                  <Ionicons name={showPassword[key] ? 'eye-off-outline' : 'eye-outline'} size={18} color={palette.muted}/>
                </AnimatedPressable>
              </View>) : (<TextInput value={form[key]} onChangeText={(value) => update(key, value)} placeholder={placeholder} placeholderTextColor={palette.muted} className={`h-14 rounded-[18px] border px-4 text-[15px] ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927] text-white' : 'border-line bg-card text-ink'}`}/>)}
          </View>))}

        <AnimatedPressable className="mt-3 items-center rounded-[18px] bg-brand py-4" onPress={() => router.push('/otp-verify')}>
          <Text className="text-[15px] font-extrabold text-white">Register</Text>
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>);
}

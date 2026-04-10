import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '../src/careermap-data';

export default function SignupScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
  });

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <ScrollView className="flex-1" contentContainerClassName="gap-[14px] px-6 py-6" showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()}>
          <Text className="text-[14px] font-bold text-muted">Back</Text>
        </Pressable>
        <Text className="text-[30px] font-black text-ink">Create Account</Text>
        <Text className="mb-1.5 text-[14px] text-muted">Join Career Map today</Text>

        {[
          ['name', 'Full Name', 'Enter your full name'],
          ['email', 'Email Address', 'Enter email'],
          ['mobile', 'Mobile Number', '+91 XXXXX XXXXX'],
          ['password', 'Password', 'Create password'],
          ['confirmPassword', 'Confirm Password', 'Re-enter password'],
          ['city', 'City', 'Enter city'],
          ['state', 'State', 'Enter state'],
        ].map(([key, label, placeholder]) => (
          <View key={key} className="gap-1.5">
            <Text className="text-[12px] font-extrabold text-muted">{label}</Text>
            <TextInput
              value={form[key as keyof typeof form]}
              onChangeText={(value) => update(key as keyof typeof form, value)}
              placeholder={placeholder}
              placeholderTextColor={palette.muted}
              className="h-14 rounded-[18px] border border-line bg-card px-4 text-[15px] text-ink"
              secureTextEntry={key.toLowerCase().includes('password')}
            />
          </View>
        ))}

        <Pressable className="mt-3 items-center rounded-[18px] bg-brand py-4" onPress={() => router.push('/otp-verify')}>
          <Text className="text-[15px] font-extrabold text-white">Register</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

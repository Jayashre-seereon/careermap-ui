import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/app-state';
import { AnimatedBackground } from '../src/animated-background';
import { palette } from '../src/careermap-data';
import { AnimatedPressable } from '../src/careermap-ui';

export default function ForgotPasswordScreen() {
  const { preferences } = useAppState();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleContinue = () => {
    if (!email.trim()) {
      setMessage('Enter your email address.');
      return;
    }

    setMessage('Password reset is not connected to the backend yet. Please use mobile OTP login or contact support.');
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <AnimatedBackground />
      <View className="flex-1 gap-4 px-6 py-6">
        <AnimatedPressable
          className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text} />
        </AnimatedPressable>
        <View className="mb-2 mt-6 items-center gap-2">
          <View className="h-[68px] w-[68px] items-center justify-center rounded-[22px]" style={{ backgroundColor: `${palette.primary}12` }}>
            <Text className="text-[26px] font-black text-brand">K</Text>
          </View>
          <Text className={`text-center text-[28px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Forgot Password</Text>
          <Text className={`max-w-[260px] text-center text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
            Enter your email address. We&apos;ll guide you to the available recovery option.
          </Text>
        </View>
        <>
          <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Email Address</Text>
          <TextInput
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setMessage('');
            }}
            placeholder="Enter your email"
            placeholderTextColor={palette.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            className={`h-14 rounded-[18px] border px-4 text-[15px] ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927] text-white' : 'border-line bg-card text-ink'}`}
          />
          <AnimatedPressable className="mt-2 items-center rounded-[18px] bg-brand py-4" onPress={handleContinue}>
            <Text className="text-[15px] font-extrabold text-white">Continue</Text>
          </AnimatedPressable>
        </>
        {message ? (
          <Text className={`text-center text-[12px] font-bold ${message === 'Enter your email address.' ? 'text-danger' : 'text-success'}`}>
            {message}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

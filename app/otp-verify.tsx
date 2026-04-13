import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '../src/careermap-data';
import { AnimatedPressable } from '../src/careermap-ui';

export default function OtpVerifyScreen() {
  const { next, identifier } = useLocalSearchParams<{ next?: string; identifier?: string }>();
  const [otp, setOtp] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="flex-1 items-center justify-center gap-[14px] px-6">
        <AnimatedPressable className="absolute left-6 top-6 h-10 w-10 items-center justify-center rounded-[14px] bg-surface" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={palette.text} />
        </AnimatedPressable>
        <Text className="text-[28px] font-black text-ink">Verify OTP</Text>
        <Text className="max-w-[260px] text-center text-[14px] text-muted">Enter the 4-digit code sent to {identifier || 'your phone'}.</Text>
        <TextInput
          value={otp}
          onChangeText={(value) => setOtp(value.replace(/\D/g, '').slice(0, 4))}
          keyboardType="number-pad"
          placeholder="0000"
          placeholderTextColor={palette.muted}
          className="h-[60px] w-full max-w-[220px] rounded-[18px] border border-line bg-card px-4 text-center text-[22px] font-extrabold tracking-[12px] text-ink"
        />
        <AnimatedPressable
          className="mt-2 w-full max-w-[260px] items-center rounded-[18px] bg-brand py-4"
          disabled={otp.length !== 4}
          onPress={() => router.replace(next || '/profile-setup')}
        >
          <Text className="text-[15px] font-extrabold text-white">Verify and Continue</Text>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}

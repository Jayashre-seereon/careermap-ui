import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { existingUsers, palette } from '../src/careermap-data';
import { AnimatedPressable } from '../src/careermap-ui';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSendReset = () => {
    const user = existingUsers.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      setMessage('User not exist with this email.');
      return;
    }
    setMessage('Reset code sent. Use 1234.');
    setStep('code');
  };

  const handleVerifyCode = () => {
    if (code !== '1234') {
      setMessage('Invalid reset code.');
      return;
    }
    router.replace('/(drawer)/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <View className="flex-1 gap-4 px-6 py-6">
        <AnimatedPressable className="h-10 w-10 items-center justify-center rounded-[14px] bg-surface" onPress={() => (step === 'code' ? setStep('email') : router.back())}>
          <Ionicons name="arrow-back" size={18} color={palette.text} />
        </AnimatedPressable>
        <View className="mb-2 mt-6 items-center gap-2">
          <View className="h-[68px] w-[68px] items-center justify-center rounded-[22px]" style={{ backgroundColor: `${palette.primary}12` }}>
            <Text className="text-[26px] font-black text-brand">K</Text>
          </View>
          <Text className="text-center text-[28px] font-black text-ink">{step === 'email' ? 'Forgot Password' : 'Enter Reset Code'}</Text>
          <Text className="max-w-[260px] text-center text-[14px] text-muted">
            {step === 'email' ? 'Enter your email to receive a reset code' : 'Enter the 4-digit code to continue'}
          </Text>
        </View>
        {step === 'email' ? (
          <>
            <Text className="text-[12px] font-extrabold text-muted">Email Address</Text>
            <TextInput value={email} onChangeText={(value) => { setEmail(value); setMessage(''); }} placeholder="Enter your email" placeholderTextColor={palette.muted} className="h-14 rounded-[18px] border border-line bg-card px-4 text-[15px] text-ink" />
            <AnimatedPressable className="mt-2 items-center rounded-[18px] bg-brand py-4" onPress={handleSendReset}>
              <Text className="text-[15px] font-extrabold text-white">Send Reset Link</Text>
            </AnimatedPressable>
          </>
        ) : (
          <>
            <Text className="text-[12px] font-extrabold text-muted">Reset Code</Text>
            <TextInput value={code} onChangeText={(value) => { setCode(value.replace(/\D/g, '').slice(0, 4)); setMessage(''); }} keyboardType="number-pad" placeholder="1234" placeholderTextColor={palette.muted} className="h-14 rounded-[18px] border border-line bg-card px-4 text-[15px] text-ink" />
            <AnimatedPressable className="mt-2 items-center rounded-[18px] bg-brand py-4" onPress={handleVerifyCode}>
              <Text className="text-[15px] font-extrabold text-white">Verify Code</Text>
            </AnimatedPressable>
          </>
        )}
        {message ? <Text className={`text-center text-[12px] font-bold ${message.includes('not exist') || message.includes('Invalid') ? 'text-danger' : 'text-success'}`}>{message}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

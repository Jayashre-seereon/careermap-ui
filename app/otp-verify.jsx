import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/app-state';
import { palette } from '../src/careermap-data';
import { AnimatedPressable } from '../src/careermap-ui';
import { AnimatedBackground } from '../src/animated-background';
import { ZoomInPage } from '../src/page-transition';
export default function OtpVerifyScreen() {
    const { preferences } = useAppState();
    const { next, identifier } = useLocalSearchParams();
    const [otp, setOtp] = useState('');
    return (<SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}> 
          <AnimatedBackground /> 
             <ZoomInPage style={{ flex: 1 }}>
             <View className="flex-1 items-center justify-center gap-[14px] px-6">
        <AnimatedPressable className={`absolute left-6 top-6 h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
        </AnimatedPressable>
        <Text className={`text-[28px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Verify OTP</Text>
        <Text className={`max-w-[260px] text-center text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Enter the 4-digit code sent to {identifier || 'your phone'}.</Text>
        <TextInput value={otp} onChangeText={(value) => setOtp(value.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" placeholder="0000" placeholderTextColor={palette.muted} className={`h-[60px] w-full max-w-[220px] rounded-[18px] border px-4 text-center text-[22px] font-extrabold tracking-[12px] ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927] text-white' : 'border-line bg-card text-ink'}`}/>
        <AnimatedPressable className="mt-2 w-full max-w-[260px] items-center rounded-[18px] bg-brand py-4 px-4" disabled={otp.length !== 4} onPress={() => router.replace(next || '/profile-setup')}>
          <Text className="text-[15px] font-extrabold text-white">Verify and Continue</Text>
        </AnimatedPressable>
      </View>
      </ZoomInPage>
    </SafeAreaView>);
}

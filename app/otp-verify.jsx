import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiErrorMessage, sendSignupOtp, verifySignupOtp } from '../src/api/authApi';
import { useAppState } from '../src/app-state';
import { palette } from '../src/careermap-data';
import { AnimatedPressable } from '../src/careermap-ui';
import { AnimatedBackground } from '../src/animated-background';
import { ZoomInPage } from '../src/page-transition';
import { useAuthStore } from '../src/store/auth-store';
import { formatOtpMobile } from '../src/utils/auth';
export default function OtpVerifyScreen() {
    const { preferences } = useAppState();
    const { next, identifier } = useLocalSearchParams();
    const signupForm = useAuthStore((state) => state.signupForm);
    const setTempToken = useAuthStore((state) => state.setTempToken);
    const mobileNumber = formatOtpMobile(typeof identifier === 'string' && identifier ? identifier : signupForm.mobile);
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [status, setStatus] = useState({
        type: 'idle',
        message: '',
    });
    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setStatus({ type: 'error', message: 'Enter the 6 digit OTP.' });
            return;
        }
        try {
            setIsSubmitting(true);
            setStatus({ type: 'idle', message: '' });
            const response = await verifySignupOtp(mobileNumber, otp);
            setTempToken(response.tempToken || '');
            setStatus({ type: 'success', message: response.message });
            router.replace(next || '/profile-setup');
        }
        catch (error) {
            setStatus({
                type: 'error',
                message: getApiErrorMessage(error, 'Failed to verify OTP.'),
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleResendOtp = async () => {
        try {
            setIsResending(true);
            setStatus({ type: 'idle', message: '' });
            const response = await sendSignupOtp(mobileNumber);
            setStatus({ type: 'success', message: response.message });
        }
        catch (error) {
            setStatus({
                type: 'error',
                message: getApiErrorMessage(error, 'Failed to resend OTP.'),
            });
        }
        finally {
            setIsResending(false);
        }
    };
    return (<SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}> 
          <AnimatedBackground /> 
             <ZoomInPage style={{ flex: 1 }}>
             <View className="flex-1 items-center justify-center gap-[14px] px-6">
        <AnimatedPressable className={`absolute left-6 top-6 h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-surface'}`} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
        </AnimatedPressable>
        <Text className={`text-[28px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Verify OTP</Text>
        <Text className={`max-w-[260px] text-center text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Enter the 6-digit code sent to {mobileNumber || 'your phone'}.</Text>
        <TextInput value={otp} onChangeText={(value) => {
            setOtp(value.replace(/\D/g, '').slice(0, 6));
            setStatus({ type: 'idle', message: '' });
        }} keyboardType="number-pad" placeholder="000000" placeholderTextColor={palette.muted} className={`h-[60px] w-full max-w-[220px] rounded-[18px] border px-4 text-center text-[22px] font-extrabold tracking-[8px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808] text-white' : 'border-line bg-card text-ink'}`}/>
        <AnimatedPressable className="mt-2 w-full max-w-[260px] items-center rounded-[18px] bg-brand py-4 px-4" disabled={otp.length !== 6 || isSubmitting} onPress={handleVerifyOtp}>
          <Text className="text-[15px] font-extrabold text-white">{isSubmitting ? 'Verifying...' : 'Verify and Continue'}</Text>
        </AnimatedPressable>
        <AnimatedPressable onPress={handleResendOtp} disabled={isResending || !mobileNumber}>
          <Text className="text-[13px] font-bold text-brand">{isResending ? 'Resending OTP...' : 'Resend OTP'}</Text>
        </AnimatedPressable>
        {status.type !== 'idle' ? (<Text className={`max-w-[260px] text-center text-[12px] font-bold ${status.type === 'error' ? 'text-danger' : 'text-success'}`}>{status.message}</Text>) : null}
      </View>
      </ZoomInPage>
    </SafeAreaView>);
}

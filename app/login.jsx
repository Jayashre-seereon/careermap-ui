import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/app-state';
import { BeeMascot } from '../src/bee-mascot';
import { existingUsers, palette } from '../src/careermap-data';
import { AnimatedPressable } from '../src/careermap-ui';
import { AnimatedBackground } from '../src/animated-background';
import { ZoomInPage } from '../src/page-transition';
export default function LoginScreen() {
    const { preferences } = useAppState();
    const { userType } = useLocalSearchParams();
    const isExistingUser = userType === 'existing';
    const [loginMode, setLoginMode] = useState('mobile');
    const [mobile, setMobile] = useState('');
    const [coupon, setCoupon] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState({
        type: 'idle',
        message: '',
    });
    const knownMobileUser = useMemo(() => existingUsers.find((item) => item.mobile === mobile), [mobile]);
    const knownCouponUser = useMemo(() => existingUsers.find((item) => item.coupon === coupon.trim().toUpperCase()), [coupon]);
    const knownEmailUser = useMemo(() => existingUsers.find((item) => item.email.toLowerCase() === email.trim().toLowerCase()), [email]);
    const handleSendOtp = () => {
        if (isExistingUser && !knownMobileUser) {
            setStatus({ type: 'error', message: 'User not exist with this mobile number.' });
            return;
        }
        router.push({
            pathname: '/otp-verify',
            params: {
                next: isExistingUser ? '/(drawer)/(tabs)' : '/profile-setup',
                identifier: mobile,
            },
        });
    };
    const handleCouponLogin = () => {
        const normalized = coupon.trim().toUpperCase();
        if (normalized.length < 3) {
            setStatus({ type: 'error', message: 'Enter a valid coupon code.' });
            return;
        }
        if (isExistingUser && !knownCouponUser) {
            setStatus({ type: 'error', message: 'User not exist with this coupon code.' });
            return;
        }
        router.replace(isExistingUser ? '/(drawer)/(tabs)' : '/profile-setup');
    };
    const handleEmailLogin = () => {
        if (!knownEmailUser) {
            setStatus({ type: 'error', message: 'User not exist with this email.' });
            return;
        }
        if (knownEmailUser.password !== password) {
            setStatus({ type: 'error', message: 'Incorrect password.' });
            return;
        }
        router.replace('/(drawer)/(tabs)');
    };
    return (<SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <AnimatedBackground />
      <ZoomInPage style={{ flex: 1 }}>
      <ScrollView className="flex-1" contentContainerClassName="flex-grow gap-6 px-6 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <AnimatedPressable className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
        </AnimatedPressable>

        <View className="items-center gap-2.5 pt-2">
          <View className="h-[96px] w-[96px] items-center justify-center ">
            <BeeMascot size={100} draggable={false}/>
          </View>
          <Text className={`text-center text-[28px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
            {isExistingUser ? 'Welcome Back' : 'Continue Your Journey'}
          </Text>
          <Text className={`text-center text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
            {isExistingUser ? "Choose how you'd like to log in" : 'Use OTP or coupon to continue'}
          </Text>
        </View>

        {isExistingUser ? (<View className={`gap-1 rounded-[18px] border p-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
            <Text className={`text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Example existing users</Text>
            <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Mobile: 9876543210</Text>
            <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Email: jaya@email.com</Text>
            <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Password: Jaya@123</Text>
            <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Coupon: CAREER2026</Text>
          </View>) : null}

        <View className={`flex-row rounded-[18px] p-1 ${preferences.darkMode ? 'bg-[#211927]' : 'bg-[#e8e2de]'}`}>
          <View className="flex-1 px-[2px]">
            <AnimatedPressable className={`items-center rounded-[14px] px-2 py-3 ${loginMode === 'mobile' ? 'bg-brand' : ''}`} onPress={() => setLoginMode('mobile')}>
                <Text className={`text-center text-[12px] font-extrabold ${loginMode === 'mobile' ? 'text-white' : preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                Mobile OTP
              </Text>
            </AnimatedPressable>
          </View>
          <View className="flex-1 px-[2px]">
            <AnimatedPressable className={`items-center rounded-[14px] px-2 py-3 ${loginMode === 'coupon' ? 'bg-brand' : ''}`} onPress={() => setLoginMode('coupon')}>
                <Text className={`text-center text-[12px] font-extrabold ${loginMode === 'coupon' ? 'text-white' : preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                Coupon
              </Text>
            </AnimatedPressable>
          </View>
          {isExistingUser ? (<View className="flex-1 px-[2px]">
              <AnimatedPressable className={`items-center rounded-[14px] px-2 py-3 ${loginMode === 'email' ? 'bg-brand' : ''}`} onPress={() => setLoginMode('email')}>
                <Text className={`text-center text-[12px] font-extrabold ${loginMode === 'email' ? 'text-white' : preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                  Email
                </Text>
              </AnimatedPressable>
            </View>) : null}
        </View>

        {loginMode === 'mobile' ? (<View className="gap-[14px]">
            <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Mobile Number</Text>
            <View className={`h-14 flex-row items-center gap-2.5 rounded-[18px] border px-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
              <Text className={`text-[15px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>+91</Text>
              <TextInput value={mobile} onChangeText={(value) => {
                setMobile(value.replace(/\D/g, '').slice(0, 10));
                setStatus({ type: 'idle', message: '' });
            }} keyboardType="number-pad" placeholder="Enter mobile number" placeholderTextColor={palette.muted} className={`flex-1 text-[15px] ${preferences.darkMode ? 'text-white' : 'text-ink'}`}/>
            </View>
            <AnimatedPressable className="mt-1.5 items-center rounded-[18px] bg-brand py-4" disabled={mobile.length !== 10} onPress={handleSendOtp}>
              <Text className="text-[15px] font-extrabold text-white">Send OTP</Text>
            </AnimatedPressable>
          </View>) : null}

        {loginMode === 'coupon' ? (<View className="gap-[14px]">
            <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Institution Coupon Code</Text>
            <TextInput value={coupon} onChangeText={(value) => {
                setCoupon(value.toUpperCase());
                setStatus({ type: 'idle', message: '' });
            }} autoCapitalize="characters" placeholder="Enter coupon code" placeholderTextColor={palette.muted} className={`h-14 rounded-[18px] border px-4 text-[15px] ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927] text-white' : 'border-line bg-card text-ink'}`}/>
            <AnimatedPressable className="mt-1.5 items-center rounded-[18px] bg-brand py-4" disabled={coupon.length < 3} onPress={handleCouponLogin}>
              <Text className="text-[15px] font-extrabold text-white">
                {isExistingUser ? 'Login with Coupon' : 'Continue with Coupon'}
              </Text>
            </AnimatedPressable>
          </View>) : null}

        {isExistingUser && loginMode === 'email' ? (<View className="gap-[14px]">
            <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Email Address</Text>
            <TextInput value={email} onChangeText={(value) => {
                setEmail(value);
                setStatus({ type: 'idle', message: '' });
            }} autoCapitalize="none" keyboardType="email-address" placeholder="Enter email" placeholderTextColor={palette.muted} className={`h-14 rounded-[18px] border px-4 text-[15px] ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927] text-white' : 'border-line bg-card text-ink'}`}/>
            <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Password</Text>
            <View className={`h-14 flex-row items-center gap-2.5 rounded-[18px] border px-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
              <TextInput value={password} onChangeText={(value) => {
                    setPassword(value);
                    setStatus({ type: 'idle', message: '' });
                }} secureTextEntry={!showPassword} placeholder="Enter password" placeholderTextColor={palette.muted} className={`flex-1 text-[15px] ${preferences.darkMode ? 'text-white' : 'text-ink'}`}/>
              <AnimatedPressable onPress={() => setShowPassword((value) => !value)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={palette.muted}/>
              </AnimatedPressable>
            </View>
            <AnimatedPressable className="mt-1.5 items-center rounded-[18px] bg-brand py-4" disabled={!email || !password} onPress={handleEmailLogin}>
              <Text className="text-[15px] font-extrabold text-white">Login with Email</Text>
            </AnimatedPressable>
          </View>) : null}

        {status.type !== 'idle' ? (<Text className={`text-center text-[12px] font-bold ${status.type === 'error' ? 'text-danger' : 'text-success'}`}>
            {status.message}
          </Text>) : null}

        <View className="mt-auto items-center gap-3 pb-2.5">
          {isExistingUser && loginMode === 'email' ? (<AnimatedPressable onPress={() => router.push('/forgot-password')}>
              <Text className={`text-[13px] font-bold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Forgot Password?</Text>
            </AnimatedPressable>) : null}

          <AnimatedPressable onPress={() => router.replace(isExistingUser ? '/onboarding' : '/auth-entry')}>
            <Text className="text-[13px] font-bold text-brand">
              {isExistingUser ? 'New user? Start onboarding' : 'Existing user? Go to login options'}
            </Text>
          </AnimatedPressable>

          <Text className={`text-center text-[11px] leading-[17px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
            By continuing, you agree to Career Map&apos;s Terms of Service and Privacy Policy.
          </Text>
        </View>
      </ScrollView>
      </ZoomInPage>
    </SafeAreaView>);
}

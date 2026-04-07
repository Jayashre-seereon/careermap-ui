import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BeeMascot } from '../src/bee-mascot';
import { palette } from '../src/careermap-data';

export default function LoginScreen() {
  const [loginMode, setLoginMode] = useState<'mobile' | 'coupon'>('mobile');
  const [mobile, setMobile] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSendOtp = () => {
    router.push('/otp-verify');
  };

  const handleCouponLogin = () => {
    if (coupon.trim().length >= 3) {
      setCouponStatus('success');
      setTimeout(() => router.replace('/profile-setup'), 500);
      return;
    }
    setCouponStatus('error');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoCard}>
            <BeeMascot size={64} />
          </View>
          <Text style={styles.title}>Welcome to Career Map</Text>
          <Text style={styles.subtitle}>Choose how you&apos;d like to sign in</Text>
        </View>

        <View style={styles.toggle}>
          <Pressable onPress={() => setLoginMode('mobile')} style={[styles.toggleItem, loginMode === 'mobile' && styles.toggleItemActive]}>
            <Text style={[styles.toggleText, loginMode === 'mobile' && styles.toggleTextActive]}>Mobile OTP</Text>
          </Pressable>
          <Pressable onPress={() => setLoginMode('coupon')} style={[styles.toggleItem, loginMode === 'coupon' && styles.toggleItemActive]}>
            <Text style={[styles.toggleText, loginMode === 'coupon' && styles.toggleTextActive]}>Coupon Code</Text>
          </Pressable>
        </View>

        {loginMode === 'mobile' ? (
          <View style={styles.form}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.mobileRow}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                value={mobile}
                onChangeText={(value) => setMobile(value.replace(/\D/g, '').slice(0, 10))}
                keyboardType="number-pad"
                placeholder="Enter mobile number"
                placeholderTextColor={palette.muted}
                style={styles.mobileInput}
              />
            </View>
            <Pressable disabled={mobile.length !== 10} onPress={handleSendOtp} style={[styles.primaryButton, mobile.length !== 10 && styles.primaryButtonDisabled]}>
              <Text style={styles.primaryButtonText}>Send OTP</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>Institution Coupon Code</Text>
            <TextInput
              value={coupon}
              onChangeText={(value) => {
                setCoupon(value.toUpperCase());
                setCouponStatus('idle');
              }}
              autoCapitalize="characters"
              placeholder="Enter coupon code"
              placeholderTextColor={palette.muted}
              style={styles.input}
            />
            <Pressable disabled={coupon.length < 3} onPress={handleCouponLogin} style={[styles.primaryButton, coupon.length < 3 && styles.primaryButtonDisabled]}>
              <Text style={styles.primaryButtonText}>Login with Coupon</Text>
            </Pressable>
            {couponStatus === 'success' ? <Text style={styles.successText}>Coupon verified. Redirecting...</Text> : null}
            {couponStatus === 'error' ? <Text style={styles.errorText}>Invalid coupon code. Try a valid institute code.</Text> : null}
          </View>
        )}

        <View style={styles.footer}>
          <Pressable onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgotLink}>Forgot Password?</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/signup')}>
            <Text style={styles.signupLink}>Create Account</Text>
          </Pressable>
          <Text style={styles.terms}>By continuing, you agree to Career Map&apos;s Terms of Service and Privacy Policy.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, padding: 24, gap: 24 },
  header: { alignItems: 'center', gap: 10, paddingTop: 20 },
  logoCard: { width: 84, height: 84, borderRadius: 28, backgroundColor: palette.card, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 30, fontWeight: '900', color: palette.primary },
  title: { fontSize: 28, fontWeight: '900', color: palette.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: palette.muted, textAlign: 'center' },
  toggle: { flexDirection: 'row', backgroundColor: '#e8e2de', borderRadius: 18, padding: 4, gap: 4 },
  toggleItem: { flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  toggleItemActive: { backgroundColor: palette.primary },
  toggleText: { fontSize: 12, fontWeight: '800', color: palette.muted },
  toggleTextActive: { color: '#fff' },
  form: { gap: 14 },
  label: { fontSize: 12, fontWeight: '800', color: palette.muted },
  input: { height: 56, borderRadius: 18, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.card, paddingHorizontal: 16, fontSize: 15, color: palette.text },
  mobileRow: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 18, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.card, paddingHorizontal: 16, gap: 10 },
  countryCode: { fontSize: 15, fontWeight: '800', color: palette.text },
  mobileInput: { flex: 1, fontSize: 15, color: palette.text },
  primaryButton: { marginTop: 6, borderRadius: 18, backgroundColor: palette.primary, paddingVertical: 16, alignItems: 'center' },
  primaryButtonDisabled: { opacity: 0.42 },
  primaryButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  successText: { fontSize: 12, fontWeight: '700', color: palette.green, textAlign: 'center' },
  errorText: { fontSize: 12, fontWeight: '700', color: palette.danger, textAlign: 'center' },
  footer: { marginTop: 'auto', alignItems: 'center', gap: 12, paddingBottom: 10 },
  forgotLink: { fontSize: 13, fontWeight: '700', color: palette.muted },
  signupLink: { fontSize: 14, fontWeight: '800', color: palette.primary },
  terms: { fontSize: 11, lineHeight: 17, color: palette.muted, textAlign: 'center' },
});

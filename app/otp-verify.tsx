import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '../src/careermap-data';

export default function OtpVerifyScreen() {
  const [otp, setOtp] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the 4-digit code sent to your phone.</Text>
        <TextInput
          value={otp}
          onChangeText={(value) => setOtp(value.replace(/\D/g, '').slice(0, 4))}
          keyboardType="number-pad"
          placeholder="0000"
          placeholderTextColor={palette.muted}
          style={styles.input}
        />
        <Pressable disabled={otp.length !== 4} onPress={() => router.replace('/profile-setup')} style={[styles.primaryButton, otp.length !== 4 && styles.primaryButtonDisabled]}>
          <Text style={styles.primaryButtonText}>Verify and Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 14 },
  title: { fontSize: 28, fontWeight: '900', color: palette.text },
  subtitle: { fontSize: 14, color: palette.muted, textAlign: 'center', maxWidth: 260 },
  input: { width: '100%', maxWidth: 220, height: 60, borderRadius: 18, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.card, textAlign: 'center', letterSpacing: 12, fontSize: 22, fontWeight: '800', color: palette.text },
  primaryButton: { width: '100%', maxWidth: 260, borderRadius: 18, backgroundColor: palette.primary, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryButtonDisabled: { opacity: 0.42 },
  primaryButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

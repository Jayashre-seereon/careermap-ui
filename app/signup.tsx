import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Career Map today</Text>

        {[
          ['name', 'Full Name', 'Enter your full name'],
          ['email', 'Email Address', 'Enter email'],
          ['mobile', 'Mobile Number', '+91 XXXXX XXXXX'],
          ['password', 'Password', 'Create password'],
          ['confirmPassword', 'Confirm Password', 'Re-enter password'],
          ['city', 'City', 'Enter city'],
          ['state', 'State', 'Enter state'],
        ].map(([key, label, placeholder]) => (
          <View key={key} style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              value={form[key as keyof typeof form]}
              onChangeText={(value) => update(key as keyof typeof form, value)}
              placeholder={placeholder}
              placeholderTextColor={palette.muted}
              style={styles.input}
              secureTextEntry={key.toLowerCase().includes('password')}
            />
          </View>
        ))}

        <Pressable onPress={() => router.push('/otp-verify')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Register</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  container: { padding: 24, gap: 14 },
  back: { fontSize: 14, fontWeight: '700', color: palette.muted },
  title: { fontSize: 30, fontWeight: '900', color: palette.text },
  subtitle: { fontSize: 14, color: palette.muted, marginBottom: 6 },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '800', color: palette.muted },
  input: { height: 56, borderRadius: 18, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.card, paddingHorizontal: 16, fontSize: 15, color: palette.text },
  primaryButton: { marginTop: 12, borderRadius: 18, backgroundColor: palette.primary, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '../src/careermap-data';

export default function ForgotPasswordScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Text style={styles.iconText}>K</Text>
          </View>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
        </View>
        <Text style={styles.label}>Email Address</Text>
        <TextInput placeholder="Enter your email" placeholderTextColor={palette.muted} style={styles.input} />
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Send Reset Link</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, padding: 24, gap: 16 },
  back: { fontSize: 14, fontWeight: '700', color: palette.muted },
  header: { alignItems: 'center', gap: 8, marginTop: 24, marginBottom: 8 },
  iconWrap: { width: 68, height: 68, borderRadius: 22, backgroundColor: `${palette.primary}12`, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 26, fontWeight: '900', color: palette.primary },
  title: { fontSize: 28, fontWeight: '900', color: palette.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: palette.muted, textAlign: 'center', maxWidth: 260 },
  label: { fontSize: 12, fontWeight: '800', color: palette.muted },
  input: { height: 56, borderRadius: 18, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.card, paddingHorizontal: 16, fontSize: 15, color: palette.text },
  primaryButton: { marginTop: 8, borderRadius: 18, backgroundColor: palette.primary, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

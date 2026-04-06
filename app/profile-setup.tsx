import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppState } from '../src/app-state';
import { palette } from '../src/careermap-data';

const selectionMeta = [
  { key: 'selectedClass', label: 'Class', icon: 'school-outline', color: palette.blue },
  { key: 'selectedStream', label: 'Stream', icon: 'layers-outline', color: palette.purple },
  { key: 'selectedClarity', label: 'Career Clarity', icon: 'compass-outline', color: palette.orange },
  { key: 'selectedGuidance', label: 'Guidance', icon: 'chatbubble-ellipses-outline', color: palette.green },
] as const;

export default function ProfileSetupScreen() {
  const { onboarding } = useAppState();
  const [form, setForm] = useState({
    name: onboarding.userType === 'parent' ? onboarding.name : onboarding.name,
    email: '',
    mobile: '',
    address: '',
    gender: '',
    dob: '',
    city: '',
    stateName: '',
  });

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const isValid = form.name && form.email && form.mobile;

  const onboardingChips = useMemo(
    () => [
      ...selectionMeta
        .map((item) => ({
          ...item,
          value: onboarding[item.key],
        }))
        .filter((item) => Boolean(item.value)),
      ...onboarding.selectedInterests.map((item) => ({ label: item, icon: 'sparkles-outline' as const, color: palette.primary })),
      ...onboarding.selectedStrengths.map((item) => ({ label: item, icon: 'flash-outline' as const, color: palette.teal })),
      ...onboarding.selectedPriorities.map((item) => ({ label: item, icon: 'flag-outline' as const, color: palette.secondary })),
    ],
    [onboarding],
  );

  const hasOnboardingSelections =
    onboarding.selectedClass ||
    onboarding.selectedStream ||
    onboarding.selectedClarity ||
    onboarding.selectedGuidance ||
    onboarding.selectedInterests.length > 0 ||
    onboarding.selectedStrengths.length > 0 ||
    onboarding.selectedPriorities.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconCard}>
            <Ionicons name="person-circle-outline" size={34} color="#fff" />
          </View>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Help us serve you better</Text>
        </View>

        {hasOnboardingSelections ? (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryIconWrap}>
                <Ionicons name="checkmark-done-circle-outline" size={18} color={palette.primary} />
              </View>
              <View style={styles.summaryHeaderText}>
                <Text style={styles.summaryTitle}>Your Onboarding Selections</Text>
                <Text style={styles.summarySubtitle}>We carried these choices over from onboarding.</Text>
              </View>
            </View>

            {onboarding.userType ? (
              <View style={styles.identityRow}>
                <View style={styles.identityPill}>
                  <Ionicons name={onboarding.userType === 'parent' ? 'people-outline' : 'person-outline'} size={14} color={palette.primary} />
                  <Text style={styles.identityPillText}>{onboarding.userType === 'parent' ? 'Parent Journey' : 'Student Journey'}</Text>
                </View>
                {onboarding.childName ? (
                  <View style={styles.identityPill}>
                    <Ionicons name="heart-outline" size={14} color={palette.orange} />
                    <Text style={[styles.identityPillText, { color: palette.orange }]}>{onboarding.childName}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            <View style={styles.chipWrap}>
              {onboardingChips.map((item) => (
                <View key={`${item.label}-${item.icon}`} style={styles.selectionChip}>
                  <Ionicons name={item.icon} size={14} color={item.color} />
                  <Text style={styles.selectionChipText}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {[
          ['name', onboarding.userType === 'parent' ? 'Parent Name' : 'Full Name', 'Enter your full name', 'person-outline'],
          ['email', 'Email Address', 'Enter email', 'mail-outline'],
          ['mobile', 'Mobile Number', '+91 XXXXX XXXXX', 'call-outline'],
          ['address', 'Address', 'Enter your address', 'location-outline'],
          ['city', 'City', 'Enter city', 'business-outline'],
          ['stateName', 'State', 'Enter state', 'map-outline'],
        ].map(([key, label, placeholder, icon]) => (
          <View key={key} style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrap}>
              <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={18} color={palette.muted} />
              <TextInput
                value={form[key as keyof typeof form]}
                onChangeText={(value) => update(key as keyof typeof form, value)}
                placeholder={placeholder}
                placeholderTextColor={palette.muted}
                style={styles.input}
              />
            </View>
          </View>
        ))}

        <View style={styles.field}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderRow}>
            {[
              { label: 'Male', icon: 'male-outline' },
              { label: 'Female', icon: 'female-outline' },
              { label: 'Other', icon: 'transgender-outline' },
            ].map((gender) => (
              <Pressable
                key={gender.label}
                onPress={() => update('gender', gender.label)}
                style={[styles.genderButton, form.gender === gender.label && styles.genderButtonActive]}
              >
                <Ionicons
                  name={gender.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={form.gender === gender.label ? '#fff' : palette.muted}
                />
                <Text style={[styles.genderButtonText, form.gender === gender.label && styles.genderButtonTextActive]}>{gender.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Date of Birth</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="calendar-outline" size={18} color={palette.muted} />
            <TextInput
              value={form.dob}
              onChangeText={(value) => update('dob', value)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={palette.muted}
              style={styles.input}
            />
          </View>
        </View>

        <Pressable disabled={!isValid} onPress={() => router.replace('/promo')} style={[styles.primaryButton, !isValid && styles.primaryButtonDisabled]}>
          <Text style={styles.primaryButtonText}>Complete Profile</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  container: { padding: 24, gap: 14 },
  header: { alignItems: 'center', gap: 8, marginBottom: 8 },
  iconCard: { width: 68, height: 68, borderRadius: 22, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: palette.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: palette.muted, textAlign: 'center' },
  summaryCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 14,
  },
  summaryHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  summaryIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: `${palette.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryHeaderText: { flex: 1, gap: 2 },
  summaryTitle: { fontSize: 15, fontWeight: '900', color: palette.text },
  summarySubtitle: { fontSize: 12, lineHeight: 18, color: palette.muted },
  identityRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  identityPill: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: palette.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  identityPillText: { fontSize: 12, fontWeight: '800', color: palette.primary },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  selectionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 999,
    backgroundColor: palette.background,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  selectionChipText: { fontSize: 12, fontWeight: '700', color: palette.text },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '800', color: palette.muted },
  inputWrap: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, color: palette.text },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  genderButtonActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  genderButtonText: { fontSize: 13, fontWeight: '800', color: palette.text },
  genderButtonTextActive: { color: '#fff' },
  primaryButton: { marginTop: 14, borderRadius: 18, backgroundColor: palette.primary, paddingVertical: 16, alignItems: 'center' },
  primaryButtonDisabled: { opacity: 0.42 },
  primaryButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

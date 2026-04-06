import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppState } from '../../../src/app-state';
import { assessmentFeatures, assessmentPolicies, palette } from '../../../src/careermap-data';
import { Screen, SectionHeader } from '../../../src/careermap-ui';

export default function AssessmentScreen() {
  const { isUnlocked } = useAppState();
  const unlocked = isUnlocked('psychometric-test');

  return (
    <Screen>
      <SectionHeader
        title="Career Assessment"
        subtitle="The mobile equivalent of the web prototype's full psychometric test entry screen."
      />

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Text style={styles.heroIconText}>AI</Text>
        </View>
        <Text style={styles.heroTitle}>Full Psychometric Test</Text>
        <Text style={styles.heroCopy}>
          A comprehensive assessment to discover aptitude, personality traits, and the careers that fit you best.
        </Text>
        <Pressable
          onPress={() =>
            unlocked
              ? router.push('/(drawer)/psychometric-test')
              : router.push({ pathname: '/checkout', params: { planId: 'psychometric' } })
          }
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>{unlocked ? 'Open Psychometric Test' : 'Subscribe to Unlock Full Test'}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Test Features</Text>
        <View style={styles.list}>
          {assessmentFeatures.map((feature) => (
            <View key={feature} style={styles.row}>
              <View style={styles.tick} />
              <Text style={styles.rowText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.card, styles.policyCard]}>
        <Text style={styles.cardTitle}>Test Policy</Text>
        <View style={styles.list}>
          {assessmentPolicies.map((policy) => (
            <Text key={policy} style={styles.policyText}>
              - {policy}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Practice Routes</Text>
        <View style={styles.linkList}>
          <Pressable onPress={() => router.push('/(drawer)/quiz')} style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Open Quiz Practice</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/(drawer)/abroad')} style={[styles.linkButton, styles.secondaryLinkButton]}>
            <Text style={[styles.linkButtonText, styles.secondaryLinkButtonText]}>Explore Study Abroad</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: palette.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 22,
    alignItems: 'center',
    gap: 10,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: `${palette.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconText: {
    fontSize: 24,
    fontWeight: '900',
    color: palette.primary,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: palette.text,
    textAlign: 'center',
  },
  heroCopy: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.muted,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 4,
    borderRadius: 999,
    backgroundColor: palette.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 12,
  },
  policyCard: {
    backgroundColor: '#fff8f8',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.text,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tick: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: palette.green,
  },
  rowText: {
    flex: 1,
    fontSize: 14,
    color: palette.text,
  },
  policyText: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
  linkList: {
    gap: 10,
  },
  linkButton: {
    borderRadius: 14,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryLinkButton: {
    backgroundColor: `${palette.blue}12`,
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  secondaryLinkButtonText: {
    color: palette.blue,
  },
});

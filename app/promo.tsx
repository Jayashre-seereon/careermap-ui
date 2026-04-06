import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '../src/careermap-data';

const features = [
  { title: 'Career Library', desc: '500+ career options across streams' },
  { title: 'Psychometric Tests', desc: 'Discover strengths and ideal fit' },
  { title: 'Expert Mentors', desc: 'Guidance from counsellors and experts' },
  { title: 'Scholarships & Exams', desc: 'Stay updated on opportunities' },
  { title: 'Study Abroad', desc: 'Explore international education paths' },
];

export default function PromoScreen() {
  const [page, setPage] = useState(0);

  if (page === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.page, styles.heroPage]}>
          <Pressable onPress={() => router.replace('/(drawer)')} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </Pressable>
          <View style={styles.heroGlowTop} />
          <View style={styles.heroGlowBottom} />
          <View style={styles.heroCard}>
            <Text style={styles.heroIcon}>CM</Text>
          </View>
          <Text style={styles.heroTitle}>Career Map</Text>
          <Text style={styles.heroTagline}>Discover Your Future</Text>
          <Text style={styles.heroCopy}>India&apos;s most comprehensive career guidance platform for students and parents.</Text>
          <View style={styles.dots}>
            <View style={styles.dotActive} />
            <View style={styles.dot} />
          </View>
          <Pressable onPress={() => setPage(1)} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Next</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <Text style={styles.pageTitle}>What You Can Explore</Text>
        <Text style={styles.pageSubtitle}>Everything you need for career guidance</Text>
        <View style={styles.featureList}>
          {features.map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dotActive} />
        </View>
        <Pressable onPress={() => router.replace('/(drawer)')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Explore the App</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  page: { flex: 1, padding: 24, justifyContent: 'center', gap: 18 },
  heroPage: { backgroundColor: palette.primary, overflow: 'hidden', alignItems: 'center' },
  closeButton: { position: 'absolute', top: 18, right: 18, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  closeText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  heroGlowTop: { position: 'absolute', top: 80, right: -70, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.06)' },
  heroGlowBottom: { position: 'absolute', bottom: -80, left: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(255,255,255,0.06)' },
  heroCard: { width: 104, height: 104, borderRadius: 30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  heroIcon: { fontSize: 34, fontWeight: '900', color: palette.primaryDeep },
  heroTitle: { fontSize: 36, fontWeight: '900', color: '#fff', textAlign: 'center' },
  heroTagline: { fontSize: 18, color: 'rgba(255,255,255,0.76)', textAlign: 'center' },
  heroCopy: { fontSize: 14, lineHeight: 22, color: 'rgba(255,255,255,0.62)', textAlign: 'center', maxWidth: 280 },
  pageTitle: { fontSize: 30, fontWeight: '900', color: palette.text, textAlign: 'center' },
  pageSubtitle: { fontSize: 14, color: palette.muted, textAlign: 'center', marginBottom: 6 },
  featureList: { gap: 12 },
  featureCard: { backgroundColor: palette.card, borderRadius: 20, borderWidth: 1, borderColor: palette.border, padding: 16, gap: 4 },
  featureTitle: { fontSize: 15, fontWeight: '800', color: palette.text },
  featureDesc: { fontSize: 12, lineHeight: 18, color: palette.muted },
  dots: { flexDirection: 'row', alignSelf: 'center', gap: 8, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.16)' },
  dotActive: { width: 28, height: 8, borderRadius: 999, backgroundColor: '#fff' },
  secondaryButton: { alignSelf: 'stretch', borderRadius: 18, backgroundColor: '#fff', paddingVertical: 16, alignItems: 'center' },
  secondaryButtonText: { fontSize: 15, fontWeight: '800', color: palette.primary },
  primaryButton: { borderRadius: 18, backgroundColor: palette.primary, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

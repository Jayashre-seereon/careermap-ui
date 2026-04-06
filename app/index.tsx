import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '../src/careermap-data';

export default function SplashRoute() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/onboarding'), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <View style={styles.card}>
        <Text style={styles.icon}>CM</Text>
      </View>
      <Text style={styles.title}>Career Map</Text>
      <Text style={styles.subtitle}>Discover Your Future</Text>
      <View style={styles.loaderTrack}>
        <View style={styles.loaderFill} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: 72,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -50,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  card: {
    width: 108,
    height: 108,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 34,
    fontWeight: '900',
    color: palette.primaryDeep,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#fff',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
  },
  loaderTrack: {
    marginTop: 28,
    width: 128,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  loaderFill: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
});

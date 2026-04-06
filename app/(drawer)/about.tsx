import { StyleSheet, Text, View } from 'react-native';

import { palette } from '../../src/careermap-data';
import { Screen, SectionHeader } from '../../src/careermap-ui';

export default function AboutScreen() {
  return (
    <Screen>
      <SectionHeader title="About CareerMap" subtitle="This screen explains what was brought across from the web prototype." />
      <View style={styles.card}>
        <Text style={styles.title}>What&apos;s included</Text>
        <Text style={styles.copy}>
          This Expo project now reflects the overall direction of your Vercel prototype: a dashboard-first experience
          with career discovery, student profile details, notifications, subscription plans, and settings.
        </Text>
        <Text style={styles.copy}>
          The content is implemented as a mobile-friendly adaptation rather than a pixel-perfect web clone, which keeps
          it natural inside React Native while still matching the prototype&apos;s information architecture.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: palette.text,
  },
  copy: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.muted,
  },
});

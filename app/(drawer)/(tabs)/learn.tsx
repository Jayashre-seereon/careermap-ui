import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppState } from '../../../src/app-state';
import { masterClasses, palette } from '../../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../../src/careermap-ui';

export default function LearnScreen() {
  const { isUnlocked } = useAppState();
  const masterClassUnlocked = isUnlocked('master-class');

  return (
    <Screen>
      <SectionHeader
        title="Master Class"
        subtitle="Learning videos and filters adapted from the web prototype's master class screen."
      />

      <View style={styles.filterRow}>
        <Pill label="Most Popular" tone={palette.primary} />
        <Pill label="Technology" tone={palette.blue} />
        <Pill label="Medical" tone={palette.green} />
        <Pill label="Business" tone={palette.orange} />
      </View>

      <View style={styles.list}>
        {masterClasses.map((item) => (
          <View key={item.title} style={[styles.card, item.locked && styles.lockedCard]}>
            <View style={styles.topRow}>
              <View style={[styles.thumb, item.locked ? styles.thumbLocked : styles.thumbOpen]}>
                <Text style={styles.thumbText}>{item.locked ? 'LOCK' : 'PLAY'}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>{item.mentor}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.duration}>{item.duration}</Text>
                  <Pill label={item.career} tone={palette.primary} />
                </View>
              </View>
            </View>
            <Pressable
              onPress={() =>
                item.locked && !masterClassUnlocked
                  ? router.push({ pathname: '/checkout', params: { planId: 'premium' } })
                  : undefined
              }
              style={[styles.actionButton, item.locked && !masterClassUnlocked ? styles.lockedButton : styles.openButton]}
            >
              <Text style={[styles.actionText, item.locked && !masterClassUnlocked ? styles.lockedButtonText : styles.openButtonText]}>
                {item.locked && !masterClassUnlocked ? 'Subscribe to Watch' : 'Watch Video'}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    gap: 14,
  },
  lockedCard: {
    opacity: 0.82,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  thumb: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbOpen: {
    backgroundColor: `${palette.primary}12`,
  },
  thumbLocked: {
    backgroundColor: '#f2eff2',
  },
  thumbText: {
    fontSize: 11,
    fontWeight: '800',
    color: palette.primaryDeep,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.text,
    lineHeight: 21,
  },
  meta: {
    fontSize: 12,
    color: palette.muted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  duration: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '700',
  },
  actionButton: {
    borderRadius: 14,
    paddingVertical: 11,
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#fff8f1',
  },
  lockedButton: {
    backgroundColor: `${palette.primary}12`,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '800',
  },
  openButtonText: {
    color: palette.primaryDeep,
  },
  lockedButtonText: {
    color: palette.primary,
  },
});

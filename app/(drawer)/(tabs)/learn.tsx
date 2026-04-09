import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppState } from '../../../src/app-state';
import { masterClasses, palette } from '../../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../../src/careermap-ui';

export default function LearnScreen() {
  const { isUnlocked } = useAppState();
  const masterClassUnlocked = isUnlocked('master-class');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'views' | 'az' | 'za'>('popular');

  let filtered = activeFilter === 'All' ? [...masterClasses] : masterClasses.filter((item) => item.career === activeFilter);

  if (sortBy === 'popular' || sortBy === 'views') filtered.sort((a, b) => b.views - a.views);
  else if (sortBy === 'az') filtered.sort((a, b) => a.title.localeCompare(b.title));
  else filtered.sort((a, b) => b.title.localeCompare(a.title));

  return (
    <Screen>
      <SectionHeader
        title="Master Class"
        subtitle="Learning videos and sorting adapted closely from the prototype master class screen."
        action={
          <Pressable onPress={() => setShowFilters((value) => !value)} style={[styles.filterToggle, showFilters && styles.filterToggleActive]}>
            <Text style={[styles.filterToggleText, showFilters && styles.filterToggleTextActive]}>Filter</Text>
          </Pressable>
        }
      />

      {showFilters ? (
        <View style={styles.sortWrap}>
          {[
            { id: 'popular' as const, label: 'Most Popular' },
            { id: 'views' as const, label: 'Most Viewed' },
            { id: 'az' as const, label: 'A-Z' },
            { id: 'za' as const, label: 'Z-A' },
          ].map((item) => (
            <Pressable key={item.id} onPress={() => setSortBy(item.id)} style={[styles.sortChip, sortBy === item.id && styles.sortChipActive]}>
              <Text style={[styles.sortChipText, sortBy === item.id && styles.sortChipTextActive]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.filterRow}>
        {['All', 'Engineering', 'Medical', 'Business', 'Technology', 'Design'].map((label) => (
          <Pressable key={label} onPress={() => setActiveFilter(label)} style={[styles.filterChip, activeFilter === label && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, activeFilter === label && styles.filterChipTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.list}>
        {filtered.map((item) => (
          <View key={item.title} style={[styles.card, item.locked && styles.lockedCard]}>
            <View style={styles.topRow}>
              <View style={[styles.thumb, item.locked ? styles.thumbLocked : styles.thumbOpen]}>
                <Text style={styles.thumbText}>{item.locked ? 'LOCK' : 'PLAY'}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>{item.mentor}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaStack}>
                    <Text style={styles.duration}>{item.duration}</Text>
                    <Text style={styles.views}>{(item.views / 1000).toFixed(1)}k views</Text>
                  </View>
                  <Pill label={item.career} tone={palette.primary} />
                </View>
              </View>
            </View>
            <Pressable
              onPress={() =>
                item.locked && !masterClassUnlocked
                  ? router.push('/subscription')
                  : item.url !== '#'
                    ? Linking.openURL(item.url)
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
  filterToggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f2ebe6',
  },
  filterToggleActive: {
    backgroundColor: palette.primary,
  },
  filterToggleText: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.text,
  },
  filterToggleTextActive: {
    color: '#fff',
  },
  sortWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f2ebe6',
  },
  sortChipActive: {
    backgroundColor: palette.primary,
  },
  sortChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: palette.text,
  },
  sortChipTextActive: {
    color: '#fff',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f2ebe6',
  },
  filterChipActive: {
    backgroundColor: palette.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.text,
  },
  filterChipTextActive: {
    color: '#fff',
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
  metaStack: {
    gap: 2,
  },
  duration: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '700',
  },
  views: {
    fontSize: 11,
    color: palette.muted,
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

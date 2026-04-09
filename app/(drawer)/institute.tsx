import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { institutes, palette } from '../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../src/careermap-ui';

export default function InstituteScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [careerFilter, setCareerFilter] = useState('All');
  const [sortAZ, setSortAZ] = useState(false);

  let filtered = [...institutes];
  if (typeFilter !== 'All') filtered = filtered.filter((item) => item.type === typeFilter);
  if (careerFilter !== 'All') filtered = filtered.filter((item) => item.career === careerFilter);
  if (sortAZ) filtered.sort((a, b) => a.name.localeCompare(b.name));

  if (selectedIndex !== null) {
    const item = filtered[selectedIndex];

    return (
      <Screen>
        <SectionHeader
          title={item.name}
          subtitle="Institute detail view shaped to match the reference prototype."
          action={
            <Pressable onPress={() => setSelectedIndex(null)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />

        <View style={styles.detailHero}>
          <View style={styles.detailIconWrap}>
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={28} color={palette.primary} />
          </View>
          <Text style={styles.detailTitle}>{item.name}</Text>
          <Text style={styles.detailLocation}>{item.location}</Text>
          <View style={styles.detailTags}>
            <Pill label={`${item.rank} ${item.type}`} tone={palette.primary} />
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailCardTitle}>About</Text>
          <Text style={styles.detailCardCopy}>{item.about}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailCardTitle}>Courses Offered</Text>
          <View style={styles.courseRow}>
            {item.courses.map((course) => (
              <View key={course} style={styles.courseChip}>
                <Text style={styles.courseChipText}>{course}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable onPress={() => Linking.openURL(item.website)} style={styles.websiteButton}>
          <Text style={styles.websiteButtonText}>Visit Official Website</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Institutes"
        subtitle="Institute directory with filters and detail cards based on the reference prototype."
        action={
          <View style={styles.actions}>
            <Pressable onPress={() => setShowFilters((value) => !value)} style={[styles.iconButton, showFilters && styles.iconButtonActive]}>
              <Text style={[styles.iconButtonText, showFilters && styles.iconButtonTextActive]}>Filter</Text>
            </Pressable>
            <Pressable onPress={() => setSortAZ((value) => !value)} style={[styles.iconButton, sortAZ && styles.iconButtonActive]}>
              <Text style={[styles.iconButtonText, sortAZ && styles.iconButtonTextActive]}>A-Z</Text>
            </Pressable>
          </View>
        }
      />

      {showFilters ? (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterLabel}>Institute Type</Text>
          <View style={styles.filterRow}>
            {['All', 'Engineering', 'Medical', 'Business', 'Design', 'Law'].map((label) => (
              <Pressable key={label} onPress={() => setTypeFilter(label)} style={[styles.filterChip, typeFilter === label && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, typeFilter === label && styles.filterChipTextActive]}>{label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.filterLabel}>Career</Text>
          <View style={styles.filterRow}>
            {['All', 'Engineering', 'Medical', 'Business', 'Design', 'Law'].map((label) => (
              <Pressable
                key={`career-${label}`}
                onPress={() => setCareerFilter(label)}
                style={[styles.filterChip, careerFilter === label && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, careerFilter === label && styles.filterChipTextActive]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.list}>
        {filtered.map((item, index) => (
          <Pressable key={item.name} onPress={() => setSelectedIndex(index)} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.badgeWrap}>
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={palette.primary} />
              </View>
              <View style={styles.body}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <View style={styles.pills}>
                  <Pill label={item.type} tone={palette.blue} />
                  <Pill label={item.rank} tone={palette.primary} />
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f2ebe6',
  },
  iconButtonActive: {
    backgroundColor: palette.primary,
  },
  iconButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: palette.text,
  },
  iconButtonTextActive: {
    color: '#fff',
  },
  filtersPanel: {
    gap: 10,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: palette.muted,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f2ebe6',
  },
  filterChipActive: {
    backgroundColor: palette.primary,
  },
  filterChipText: {
    fontSize: 11,
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
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
  },
  badgeWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: `${palette.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.text,
  },
  location: {
    fontSize: 12,
    color: palette.muted,
  },
  pills: {
    flexDirection: 'row',
    gap: 8,
  },
  courseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courseChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f7f2fb',
  },
  courseChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.purple,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f2ebe6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailHero: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  detailIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: `${palette.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: palette.text,
    textAlign: 'center',
  },
  detailLocation: {
    fontSize: 13,
    color: palette.muted,
    textAlign: 'center',
  },
  detailTags: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  detailCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    gap: 10,
  },
  detailCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.primary,
  },
  detailCardCopy: {
    fontSize: 13,
    lineHeight: 21,
    color: palette.muted,
  },
  websiteButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: `${palette.primary}12`,
  },
  websiteButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.primary,
  },
});

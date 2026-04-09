import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, scholarships } from '../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../src/careermap-ui';
import { useAppState } from '../../src/app-state';

export default function ScholarshipScreen() {
  const { isUnlocked } = useAppState();
  const scholarshipUnlocked = isUnlocked('scholarship');
  const [showFilters, setShowFilters] = useState(false);
  const [activeStatus, setActiveStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'Default' | 'A-Z' | 'Z-A'>('Default');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [detailTimer, setDetailTimer] = useState(10);
  const [detailLocked, setDetailLocked] = useState(false);

  let filtered = activeStatus === 'All' ? [...scholarships] : scholarships.filter((item) => item.status === activeStatus);
  if (sortBy === 'A-Z') filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'Z-A') filtered.sort((a, b) => b.name.localeCompare(a.name));

  useEffect(() => {
    if (selectedIndex === null || scholarshipUnlocked || detailLocked) return;
    const timer = setInterval(() => {
      setDetailTimer((value) => {
        if (value <= 1) {
          clearInterval(timer);
          setDetailLocked(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedIndex, scholarshipUnlocked, detailLocked]);

  if (selectedIndex !== null) {
    const item = scholarships[selectedIndex];

    return (
      <Screen>
        <SectionHeader
          title={item.name}
          subtitle="Scholarship detail page closely matching the reference structure."
          action={
            <Pressable onPress={() => {
              setSelectedIndex(null);
              setDetailTimer(10);
              setDetailLocked(false);
            }} style={styles.backButton}>
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />

        {!scholarshipUnlocked && !detailLocked ? (
          <View style={styles.timerBadge}>
            <Text style={styles.timerBadgeText}>{detailTimer}s preview</Text>
          </View>
        ) : null}

        {detailLocked ? (
          <View style={styles.lockedDetailCard}>
            <View style={styles.lockedIconWrap}>
              <Ionicons name="lock-closed-outline" size={28} color="#fff" />
            </View>
            <Text style={styles.lockedDetailTitle}>Preview Time Expired</Text>
            <Text style={styles.lockedDetailCopy}>Subscribe to access full scholarship details, requirements, and application links.</Text>
            <Pressable onPress={() => router.push('/subscription')} style={styles.applyButtonLocked}>
              <Text style={styles.applyButtonText}>View Plans</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.detailHero}>
              <View style={styles.detailHeroIcon}>
                <Ionicons name="ribbon-outline" size={28} color={palette.green} />
              </View>
              <Text style={styles.detailHeroTitle}>{item.name}</Text>
              <Text style={styles.detailHeroProvider}>by {item.provider}</Text>
              <View style={styles.detailHeroTagRow}>
                <Pill label={item.status} tone={item.status === 'Active' ? palette.green : item.status === 'Expired' ? palette.danger : palette.orange} />
                <Pill label={item.tag} tone={palette.primary} />
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.metaColumn}>
                <View style={styles.metaInfoRow}>
                  <Text style={styles.metaLabel}>Amount</Text>
                  <Text style={styles.amount}>{item.amount}</Text>
                </View>
                <View style={styles.metaInfoRow}>
                  <Text style={styles.metaLabel}>Deadline</Text>
                  <Text style={styles.metaValue}>{item.deadline}</Text>
                </View>
                <View style={styles.metaInfoRow}>
                  <Text style={styles.metaLabel}>Eligibility</Text>
                  <Text style={styles.metaValueRight}>{item.eligibility}</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.detailBlockTitle}>About This Scholarship</Text>
              <Text style={styles.detailBlockCopy}>{item.description}</Text>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.detailBlockTitle}>Requirements</Text>
              {item.requirements.map((requirement) => (
                <View key={requirement} style={styles.requirementRow}>
                  <View style={styles.requirementDot} />
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={() => Linking.openURL(item.link)}
              style={styles.applyButton}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </Pressable>
          </>
        )}
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Scholarships"
        subtitle="Scholarship directory with filters and drill-down cards adapted from the prototype."
        action={
          <Pressable onPress={() => setShowFilters((value) => !value)} style={[styles.filterButton, showFilters && styles.filterButtonActive]}>
            <Text style={[styles.filterButtonText, showFilters && styles.filterButtonTextActive]}>Filter</Text>
          </Pressable>
        }
      />

      <View style={styles.introCard}>
        <View style={styles.introIconWrap}>
          <Ionicons name="ribbon-outline" size={24} color={palette.green} />
        </View>
        <View style={styles.introBody}>
          <Text style={styles.introTitle}>Scholarships & Funding</Text>
          <Text style={styles.introCopy}>Explore active opportunities, compare deadlines, and unlock full details like the reference prototype.</Text>
        </View>
      </View>

      {showFilters ? (
        <View style={styles.filtersPanel}>
          <View style={styles.filterRow}>
            {['All', 'Active', 'Expired', 'Due Date Expired', 'Closed'].map((label) => (
              <Pressable key={label} onPress={() => setActiveStatus(label)} style={[styles.filterChip, activeStatus === label && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, activeStatus === label && styles.filterChipTextActive]}>{label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.filterRow}>
            {(['Default', 'A-Z', 'Z-A'] as const).map((label) => (
              <Pressable key={label} onPress={() => setSortBy(label)} style={[styles.filterChip, sortBy === label && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, sortBy === label && styles.filterChipTextActive]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.list}>
        {filtered.slice(0, scholarshipUnlocked ? filtered.length : 6).map((item) => (
          <Pressable
            key={item.name}
            onPress={() => {
              setSelectedIndex(scholarships.indexOf(item));
              setDetailTimer(10);
              setDetailLocked(false);
            }}
            style={styles.card}
          >
            <View style={styles.listCardRow}>
              <View style={styles.listCardIcon}>
                <Ionicons name="ribbon-outline" size={20} color={palette.green} />
              </View>
              <View style={styles.listCardBody}>
                <View style={styles.header}>
                  <View style={styles.headerText}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.provider}>{item.provider}</Text>
                  </View>
                  <Pill label={item.status} tone={item.status === 'Active' ? palette.green : item.status === 'Expired' ? palette.danger : palette.orange} />
                </View>
                <Text style={styles.eligibility}>{item.eligibility}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.amount}>{item.amount}</Text>
                  <Text style={styles.deadline}>{item.deadline}</Text>
                </View>
              </View>
            </View>
            <Pill label={item.tag} tone={palette.primary} />
          </Pressable>
        ))}
      </View>

      {!scholarshipUnlocked && filtered.length > 4 ? (
        <View style={styles.lockedPanel}>
          <Text style={styles.lockedPanelTitle}>Subscribe to See More</Text>
          <Text style={styles.lockedPanelCopy}>More scholarship listings and full application details stay locked until subscription.</Text>
          <Pressable onPress={() => router.push('/subscription')} style={styles.lockedPanelButton}>
            <Text style={styles.lockedPanelButtonText}>Subscribe to More</Text>
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  introCard: {
    backgroundColor: palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  introIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: `${palette.green}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introBody: {
    flex: 1,
    gap: 4,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: palette.text,
  },
  introCopy: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f2ebe6',
  },
  filterButtonActive: {
    backgroundColor: palette.primary,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.text,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  filtersPanel: {
    gap: 10,
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
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.text,
  },
  provider: {
    fontSize: 12,
    color: palette.muted,
  },
  eligibility: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.text,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  amount: {
    fontSize: 13,
    fontWeight: '800',
    color: palette.green,
  },
  deadline: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '700',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f2ebe6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: `${palette.orange}12`,
  },
  timerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: palette.orange,
  },
  metaColumn: {
    gap: 8,
  },
  detailHero: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  detailHeroIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: `${palette.green}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailHeroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: palette.text,
    textAlign: 'center',
  },
  detailHeroProvider: {
    fontSize: 13,
    color: palette.muted,
    textAlign: 'center',
  },
  detailHeroTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  lockedDetailCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
    gap: 12,
    alignItems: 'center',
  },
  lockedIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedDetailTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: palette.text,
    textAlign: 'center',
  },
  lockedDetailCopy: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
    textAlign: 'center',
  },
  detailBlock: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    gap: 10,
  },
  detailBlockTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.primary,
  },
  detailBlockCopy: {
    fontSize: 13,
    lineHeight: 21,
    color: palette.muted,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  requirementDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: palette.primary,
    marginTop: 6,
  },
  requirementText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
  listCardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  listCardIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: `${palette.green}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listCardBody: {
    flex: 1,
    gap: 8,
  },
  metaInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  metaLabel: {
    fontSize: 12,
    color: palette.muted,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '800',
    color: palette.text,
  },
  metaValueRight: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '800',
    color: palette.text,
  },
  applyButton: {
    borderRadius: 16,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonLocked: {
    backgroundColor: palette.primary,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  lockedPanel: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: `${palette.primary}10`,
    gap: 6,
  },
  lockedPanelTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.primary,
  },
  lockedPanelCopy: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
  lockedPanelButton: {
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  lockedPanelButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
});

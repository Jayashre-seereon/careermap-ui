import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';

import { palette, studyAbroadCountries } from '../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../src/careermap-ui';
import { useAppState } from '../../src/app-state';

export default function AbroadScreen() {
  const { isUnlocked } = useAppState();
  const unlocked = isUnlocked('abroad-consultancy');
  const [selected, setSelected] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [detailTimer, setDetailTimer] = useState(10);
  const [detailLocked, setDetailLocked] = useState(false);
  const [preferredCountry, setPreferredCountry] = useState('');
  const [courseInterest, setCourseInterest] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [preferredIntake, setPreferredIntake] = useState('');

  useEffect(() => {
    if (selected === null || unlocked || detailLocked) return;
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
  }, [selected, unlocked, detailLocked]);

  if (submitted) {
    return (
      <Screen>
        <SectionHeader
          title="Request Sent"
          subtitle="Consultation request state added to match the prototype flow."
          action={
            <Pressable
              onPress={() => {
                setSubmitted(false);
                setShowForm(false);
                setPreferredCountry('');
                setCourseInterest('');
                setBudgetRange('');
                setPreferredIntake('');
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Our team will contact you shortly</Text>
          <Text style={styles.detailCopy}>
            Your study abroad consultation request has been recorded. We will help you shortlist countries, courses, and scholarship options.
          </Text>
          <Pressable
            onPress={() => {
              setSubmitted(false);
              setShowForm(false);
              setPreferredCountry('');
              setCourseInterest('');
              setBudgetRange('');
              setPreferredIntake('');
            }}
            style={styles.formButton}
          >
            <Text style={styles.formButtonText}>Done</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (showForm) {
    return (
      <Screen>
        <SectionHeader
          title="Consultation Form"
          subtitle="A lightweight consultancy form matching the prototype structure."
          action={
            <Pressable onPress={() => setShowForm(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />
        <View style={styles.formCard}>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Preferred Country</Text>
            <TextInput value={preferredCountry} onChangeText={setPreferredCountry} placeholder="e.g. USA, UK, Canada" placeholderTextColor={palette.muted} style={styles.formInput} />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Course Interest</Text>
            <TextInput value={courseInterest} onChangeText={setCourseInterest} placeholder="e.g. MS in Computer Science" placeholderTextColor={palette.muted} style={styles.formInput} />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Budget Range</Text>
            <TextInput value={budgetRange} onChangeText={setBudgetRange} placeholder="e.g. 20-30 LPA" placeholderTextColor={palette.muted} style={styles.formInput} />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Preferred Intake</Text>
            <TextInput value={preferredIntake} onChangeText={setPreferredIntake} placeholder="e.g. Fall 2025" placeholderTextColor={palette.muted} style={styles.formInput} />
          </View>
          <Pressable onPress={() => (unlocked ? setSubmitted(true) : router.push('/subscription'))} style={[styles.formButton, !unlocked && styles.formButtonLocked]}>
            <Text style={styles.formButtonText}>{unlocked ? 'Submit Request' : 'Subscribe to Submit'}</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (selected !== null) {
    const country = studyAbroadCountries[selected];
    return (
      <Screen>
        <SectionHeader
          title={country.name}
          subtitle="Expanded country detail page adapted from the reference prototype."
          action={
            <Pressable onPress={() => {
              setSelected(null);
              setDetailTimer(10);
              setDetailLocked(false);
            }} style={styles.backButton}>
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />
        {!unlocked && !detailLocked ? (
          <View style={styles.timerBadge}>
            <Text style={styles.timerBadgeText}>{detailTimer}s preview</Text>
          </View>
        ) : null}
        {detailLocked ? (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Preview Time Expired</Text>
            <Text style={styles.detailCopy}>Subscribe to access full country details and guidance.</Text>
            <Pressable onPress={() => router.push('/subscription')} style={[styles.formButton, styles.formButtonLocked]}>
              <Text style={styles.formButtonText}>View Plans</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.detailHero}>
              <View style={styles.detailFlagWrap}>
                <Text style={styles.detailFlag}>{country.flag}</Text>
              </View>
              <Text style={styles.detailHeroTitle}>{country.name}</Text>
              <Text style={styles.detailHeroCopy}>{country.description}</Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Overview</Text>
              <Text style={styles.detailCopy}>{country.detail}</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoCard}>
                  <Ionicons name="cash-outline" size={18} color={palette.green} />
                  <Text style={styles.infoLabel}>Tuition</Text>
                  <Text style={styles.infoValue}>{country.tuition}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Ionicons name="school-outline" size={18} color={palette.blue} />
                  <Text style={styles.infoLabel}>Living Cost</Text>
                  <Text style={styles.infoValue}>{country.living}</Text>
                </View>
              </View>
              <View style={styles.pillRow}>
                <Pill label={country.visa} tone={palette.blue} />
                <Pill label={country.intake} tone={palette.green} />
              </View>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Visa & Work Rights</Text>
              <Text style={styles.blockText}>Visa: {country.visa}</Text>
              <Text style={styles.blockText}>Intakes: {country.intake}</Text>
              <Text style={styles.blockText}>Work: {country.workRights}</Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Top Universities</Text>
              {country.topUniversities.map((university) => (
                <Text key={university} style={styles.blockText}>- {university}</Text>
              ))}
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Popular Courses</Text>
              <View style={styles.pillRow}>
                {country.popularCourses.map((course) => (
                  <Pill key={course} label={course} tone={palette.primary} />
                ))}
              </View>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Scholarships</Text>
              {country.scholarships.map((scholarship) => (
                <Text key={scholarship} style={styles.blockText}>- {scholarship}</Text>
              ))}
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Requirements</Text>
              {country.requirements.map((requirement) => (
                <Text key={requirement} style={styles.blockText}>- {requirement}</Text>
              ))}
            </View>
            <Pressable
              onPress={() => {
                setPreferredCountry(country.name);
                setShowForm(true);
              }}
              style={styles.formButton}
            >
              <Text style={styles.formButtonText}>Consult Now</Text>
            </Pressable>
          </>
        )}
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="Study Abroad" subtitle="Country list and consultancy flow adapted from the prototype." />
      <View style={styles.heroBanner}>
        <View style={styles.heroIconWrap}>
          <Ionicons name="globe-outline" size={28} color={palette.teal} />
        </View>
        <Text style={styles.heroBannerTitle}>Study Abroad</Text>
        <Text style={styles.heroBannerCopy}>Explore top destinations, compare tuition and living cost, and request counselling from the same flow as the git prototype.</Text>
      </View>
      <View style={styles.list}>
        {studyAbroadCountries.map((country, index) => (
          <Pressable
            key={country.name}
            onPress={() => {
              setSelected(index);
              setDetailTimer(10);
              setDetailLocked(false);
            }}
            style={styles.countryCard}
          >
            <View style={styles.countryRow}>
              <View style={styles.countryFlagWrap}>
                <Text style={styles.countryFlag}>{country.flag}</Text>
              </View>
              <View style={styles.countryBody}>
                <Text style={styles.countryName}>{country.name}</Text>
                <Text style={styles.countryCopy}>{country.description}</Text>
                <Text style={styles.countryMeta}>{country.tuition}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </View>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={() => setShowForm(true)} style={styles.formButton}>
        <Text style={styles.formButtonText}>Consult Now</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroBanner: {
    backgroundColor: palette.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
    gap: 8,
    alignItems: 'center',
  },
  heroIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: `${palette.teal}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: palette.text,
  },
  heroBannerCopy: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
    textAlign: 'center',
  },
  list: {
    gap: 12,
  },
  countryCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 6,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countryFlagWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${palette.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryBody: {
    flex: 1,
    gap: 3,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.text,
  },
  countryFlag: {
    fontSize: 11,
    fontWeight: '900',
    color: palette.primary,
  },
  countryCopy: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
  countryMeta: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.primary,
  },
  detailCard: {
    backgroundColor: palette.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 22,
    gap: 12,
  },
  detailHero: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  detailFlagWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: `${palette.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailFlag: {
    fontSize: 18,
    fontWeight: '900',
    color: palette.primary,
  },
  detailHeroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: palette.text,
    textAlign: 'center',
  },
  detailHeroCopy: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
    textAlign: 'center',
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
  detailTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: palette.text,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.primary,
  },
  detailCopy: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.muted,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  infoCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#f8f4ff',
    padding: 16,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: palette.muted,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.purple,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  blockText: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
  formCard: {
    backgroundColor: palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 14,
  },
  formField: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.muted,
  },
  formInput: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 13,
    color: palette.text,
  },
  formButton: {
    borderRadius: 16,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  formButtonLocked: {
    backgroundColor: palette.primary,
  },
  formButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
});

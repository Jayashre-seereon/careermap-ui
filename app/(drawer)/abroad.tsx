import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useState } from 'react';

import { palette } from '../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../src/careermap-ui';

const countries = [
  { name: 'USA', description: 'Top universities, F-1 visa, strong STEM pathways.', tuition: '$20k-$55k / year' },
  { name: 'United Kingdom', description: 'One-year Masters and globally recognized universities.', tuition: 'GBP 10k-38k / year' },
  { name: 'Canada', description: 'PR-friendly route and affordable postgraduate options.', tuition: 'CAD 15k-35k / year' },
  { name: 'Germany', description: 'Low-cost public education and strong engineering reputation.', tuition: 'EUR 250-500 / semester' },
];

export default function AbroadScreen() {
  const [selected, setSelected] = useState<number | null>(null);

  if (selected !== null) {
    const country = countries[selected];
    return (
      <Screen>
        <SectionHeader title={country.name} subtitle="A simplified study-abroad detail page adapted from the web prototype." />
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{country.name}</Text>
          <Text style={styles.detailCopy}>{country.description}</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Typical Tuition</Text>
            <Text style={styles.infoValue}>{country.tuition}</Text>
          </View>
          <View style={styles.pillRow}>
            <Pill label="Visa Support" tone={palette.blue} />
            <Pill label="University Match" tone={palette.green} />
            <Pill label="Counselling" tone={palette.orange} />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="Study Abroad" subtitle="Country overviews inspired by the web prototype's abroad consultancy flow." />
      <View style={styles.list}>
        {countries.map((country, index) => (
          <Pressable key={country.name} onPress={() => setSelected(index)} style={styles.countryCard}>
            <Text style={styles.countryName}>{country.name}</Text>
            <Text style={styles.countryCopy}>{country.description}</Text>
            <Text style={styles.countryMeta}>{country.tuition}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  countryName: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.text,
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
  detailTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: palette.text,
  },
  detailCopy: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.muted,
  },
  infoCard: {
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
});

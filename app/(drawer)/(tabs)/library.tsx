import { StyleSheet, Text, View } from 'react-native';

import { featuredCareers, palette, streamCards } from '../../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../../src/careermap-ui';

export default function LibraryScreen() {
  return (
    <Screen>
      <SectionHeader
        title="Career Library"
        subtitle="A mobile-friendly version of the stream and career discovery flow from the web prototype."
      />

      <View style={styles.streamGrid}>
        {streamCards.map((stream) => (
          <View key={stream.title} style={styles.streamCard}>
            <View style={[styles.streamDot, { backgroundColor: stream.tone }]} />
            <Text style={styles.streamTitle}>{stream.title}</Text>
            <Text style={styles.streamDescription}>{stream.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.filterRow}>
        <Pill label="Technology" tone={palette.blue} />
        <Pill label="Medical" tone={palette.green} />
        <Pill label="Design" tone={palette.orange} />
        <Pill label="Business" tone={palette.pink} />
      </View>

      <View style={styles.list}>
        {featuredCareers.map((career) => (
          <View key={career.title} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>{career.title}</Text>
              <Pill label={career.tag} tone={palette.teal} />
            </View>
            <Text style={styles.fit}>{career.fit}</Text>
            <Text style={styles.description}>{career.description}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Skills match</Text>
              <Text style={styles.metaAccent}>92%</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  streamGrid: {
    gap: 12,
  },
  streamCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
  },
  streamDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  streamTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.text,
  },
  streamDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
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
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: palette.text,
  },
  fit: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.primary,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: palette.muted,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  meta: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '600',
  },
  metaAccent: {
    fontSize: 14,
    color: palette.teal,
    fontWeight: '800',
  },
});

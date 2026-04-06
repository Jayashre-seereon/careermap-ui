import { StyleSheet, Text, View } from 'react-native';

import { featuredMentors, palette } from '../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../src/careermap-ui';

export default function BookMentorScreen() {
  return (
    <Screen>
      <SectionHeader
        title="Book Mentor"
        subtitle="A mobile-friendly mentor booking screen based on the web prototype's mentor section."
      />

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Expert Guidance for the Next Big Decision</Text>
        <Text style={styles.heroCopy}>
          Explore counsellors across engineering, design, and career planning, then reserve a 1-on-1 slot.
        </Text>
      </View>

      <View style={styles.list}>
        {featuredMentors.map((mentor) => (
          <View key={mentor.name} style={styles.card}>
            <View style={[styles.avatar, { backgroundColor: `${mentor.accent}15` }]}>
              <Text style={[styles.avatarText, { color: mentor.accent }]}>{mentor.name.charAt(0)}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.name}>{mentor.name}</Text>
              <Text style={styles.specialty}>{mentor.specialty}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{mentor.rating} rating</Text>
                <Text style={styles.meta}>{mentor.experience}</Text>
              </View>
            </View>
            <Pill label="Available" tone={palette.green} />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
    gap: 8,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: palette.text,
  },
  heroCopy: {
    fontSize: 14,
    lineHeight: 21,
    color: palette.muted,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.text,
  },
  specialty: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  meta: {
    fontSize: 11,
    color: palette.muted,
  },
});

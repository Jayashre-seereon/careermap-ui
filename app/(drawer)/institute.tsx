import { StyleSheet, Text, View } from 'react-native';

import { institutes, palette } from '../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../src/careermap-ui';

export default function InstituteScreen() {
  return (
    <Screen>
      <SectionHeader
        title="Institutes"
        subtitle="A mobile-friendly institute directory based on the web prototype's institute screen."
      />

      <View style={styles.filterRow}>
        <Pill label="All" tone={palette.primary} />
        <Pill label="Engineering" tone={palette.blue} />
        <Pill label="Medical" tone={palette.green} />
        <Pill label="Business" tone={palette.orange} />
      </View>

      <View style={styles.list}>
        {institutes.map((item) => (
          <View key={item.name} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.badgeWrap}>
                <Text style={styles.badgeText}>{item.rank}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <View style={styles.pills}>
                  <Pill label={item.type} tone={palette.blue} />
                </View>
              </View>
            </View>
            <View style={styles.courseRow}>
              {item.courses.map((course) => (
                <View key={course} style={styles.courseChip}>
                  <Text style={styles.courseChipText}>{course}</Text>
                </View>
              ))}
            </View>
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
  badgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: palette.primary,
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
});

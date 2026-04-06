import { StyleSheet, Text, View } from 'react-native';

import { palette, scholarships } from '../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../src/careermap-ui';

export default function ScholarshipScreen() {
  return (
    <Screen>
      <SectionHeader
        title="Scholarships"
        subtitle="A mobile-friendly scholarship directory inspired by the web prototype's scholarship screen."
      />

      <View style={styles.filterRow}>
        <Pill label="All" tone={palette.primary} />
        <Pill label="Active" tone={palette.green} />
        <Pill label="National" tone={palette.blue} />
        <Pill label="Merit" tone={palette.orange} />
      </View>

      <View style={styles.list}>
        {scholarships.map((item) => (
          <View key={item.name} style={styles.card}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.provider}>{item.provider}</Text>
              </View>
              <Pill label={item.status} tone={item.status === 'Active' ? palette.green : palette.orange} />
            </View>
            <Text style={styles.eligibility}>{item.eligibility}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.amount}>{item.amount}</Text>
              <Text style={styles.deadline}>{item.deadline}</Text>
            </View>
            <Pill label={item.tag} tone={palette.primary} />
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
});

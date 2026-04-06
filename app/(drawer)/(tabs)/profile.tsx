import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { palette, studentProfile } from '../../../src/careermap-data';
import { ListRow, Pill, Screen, SectionHeader } from '../../../src/careermap-ui';

export default function ProfileScreen() {
  return (
    <Screen>
      <SectionHeader title="My Profile" subtitle="A mobile adaptation of the richer profile area from the web prototype." />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <Text style={styles.name}>{studentProfile.name}</Text>
        <Text style={styles.detail}>{studentProfile.email}</Text>
        <Text style={styles.detail}>{studentProfile.mobile}</Text>
        <View style={styles.badges}>
          <Pill label={studentProfile.standard} tone={palette.primary} />
          <Pill label={studentProfile.stream} tone={palette.purple} />
        </View>
        <Pill label="Parent Account Preview" tone={palette.secondary} />
      </View>

      <View style={styles.menu}>
        <ListRow icon="bookmark-outline" title="Saved Careers" value="18 saved" />
        <ListRow icon="analytics-outline" title="Test History" value="6 tests" />
        <ListRow icon="people-outline" title="Mentor Bookings" value="3 bookings" />
        <ListRow
          icon="card-outline"
          title="Subscription"
          value={studentProfile.subscription}
          onPress={() => router.push('/(drawer)/subscription')}
        />
        <ListRow icon="settings-outline" title="Settings" onPress={() => router.push('/(drawer)/settings')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: palette.card,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#f8ece7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '900',
    color: palette.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: palette.text,
  },
  detail: {
    fontSize: 13,
    color: palette.muted,
  },
  badges: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  menu: {
    gap: 12,
  },
});

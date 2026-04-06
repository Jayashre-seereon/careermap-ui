import { StyleSheet, Text, View } from 'react-native';

import { notifications, palette } from '../../src/careermap-data';
import { Screen, SectionHeader } from '../../src/careermap-ui';

export default function NotificationsScreen() {
  return (
    <Screen>
      <SectionHeader title="Notifications" subtitle="Recent updates from mentors, scholarships, and learning content." />
      <View style={styles.list}>
        {notifications.map((item) => (
          <View key={item.id} style={[styles.card, item.unread && styles.unreadCard]}>
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
              {item.unread ? <View style={styles.dot} /> : null}
            </View>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
  },
  unreadCard: {
    borderColor: '#e2b8a8',
    backgroundColor: '#fff8f4',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: palette.text,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: palette.primary,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    color: palette.muted,
  },
  time: {
    fontSize: 12,
    color: palette.primary,
    fontWeight: '700',
  },
});

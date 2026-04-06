import { StyleSheet, Text, View } from 'react-native';

import { palette, settingsItems } from '../../src/careermap-data';
import { ListRow, Screen, SectionHeader } from '../../src/careermap-ui';

export default function SettingsScreen() {
  return (
    <Screen>
      <SectionHeader title="Settings" subtitle="A simple settings list inspired by the deployed prototype." />
      <View style={styles.list}>
        {settingsItems.map((item) => (
          <ListRow key={item} icon="options-outline" title={item} />
        ))}
      </View>
      <View style={styles.logoutCard}>
        <Text style={styles.logoutTitle}>Logout</Text>
        <Text style={styles.logoutText}>This is a prototype surface, so the action is presented as a visual state only.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  logoutCard: {
    backgroundColor: '#fff4f2',
    borderColor: '#efc8c0',
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 6,
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.danger,
  },
  logoutText: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
});

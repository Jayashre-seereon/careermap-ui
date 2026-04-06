import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from './careermap-data';

type HeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function SectionHeader({ title, subtitle, action }: HeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function HeroCard({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.heroCard}>
      <Text style={styles.heroEyebrow}>{eyebrow}</Text>
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroDescription}>{description}</Text>
    </View>
  );
}

export function Pill({ label, tone = palette.primary }: { label: string; tone?: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: `${tone}15` }]}>
      <Text style={[styles.pillText, { color: tone }]}>{label}</Text>
    </View>
  );
}

export function InfoCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  const content = (
    <View style={styles.infoCard}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={20} color={palette.primary} />
      </View>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoSubtitle}>{subtitle}</Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

export function ListRow({
  icon,
  title,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.rowLeading}>
        <View style={styles.rowIconWrap}>
          <Ionicons name={icon} size={18} color={palette.primary} />
        </View>
        <Text style={styles.rowTitle}>{title}</Text>
      </View>
      <View style={styles.rowTrailing}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={18} color={palette.muted} />
      </View>
    </Pressable>
  );
}

export function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statDot, { backgroundColor: tone }]} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    padding: 20,
    gap: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionHeaderText: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: palette.muted,
    lineHeight: 18,
  },
  heroCard: {
    backgroundColor: palette.card,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#5a3b1f',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
    gap: 10,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: palette.primary,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
    color: palette.text,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.muted,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: palette.card,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
    minHeight: 140,
    gap: 10,
    flex: 1,
    minWidth: '47%',
  },
  infoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#f8ece7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.text,
  },
  infoSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
  pressable: {
    borderRadius: 24,
    minWidth: '47%',
    flex: 1,
  },
  pressed: {
    opacity: 0.82,
  },
  row: {
    backgroundColor: palette.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#f8ece7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
    flex: 1,
  },
  rowTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '600',
  },
  statCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    flex: 1,
    gap: 10,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: palette.text,
  },
  statLabel: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '600',
  },
});

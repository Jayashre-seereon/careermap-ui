import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppState } from '../../src/app-state';
import { palette, subscriptions } from '../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../src/careermap-ui';

export default function SubscriptionScreen() {
  const { activePlanId } = useAppState();

  return (
    <Screen>
      <SectionHeader
        title="Subscription Plans"
        subtitle="Key plans from the Vercel prototype, adapted here as mobile cards."
      />

      <View style={styles.list}>
        {subscriptions.map((plan) => (
          <View key={plan.id} style={[styles.card, plan.recommended && styles.recommendedCard]}>
            <View style={styles.topRow}>
              <View style={styles.cardText}>
                <Text style={styles.name}>{plan.name}</Text>
                <Text style={styles.description}>{plan.description}</Text>
              </View>
              {plan.recommended ? <Pill label="Recommended" tone={palette.primary} /> : null}
            </View>
            <Text style={styles.price}>{plan.price}</Text>
            <View style={styles.features}>
              {plan.features.map((feature) => (
                <View key={feature} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={18} color={palette.green} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            <Pressable
              onPress={() => router.push({ pathname: '/checkout', params: { planId: plan.id } })}
              style={[styles.actionButton, activePlanId === plan.id ? styles.activeButton : styles.chooseButton]}
            >
              <Text style={[styles.actionText, activePlanId === plan.id ? styles.activeButtonText : styles.chooseButtonText]}>
                {activePlanId === plan.id ? 'Current Plan' : 'Choose Plan'}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
  },
  recommendedCard: {
    borderColor: '#dcb3a3',
    shadowColor: palette.primary,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardText: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: palette.text,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
  price: {
    fontSize: 28,
    fontWeight: '900',
    color: palette.primary,
  },
  features: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: palette.text,
    fontWeight: '600',
  },
  actionButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  chooseButton: {
    backgroundColor: palette.primary,
  },
  activeButton: {
    backgroundColor: `${palette.green}14`,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '800',
  },
  chooseButtonText: {
    color: '#fff',
  },
  activeButtonText: {
    color: palette.green,
  },
});

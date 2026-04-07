import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppState } from '../src/app-state';
import { palette, subscriptions } from '../src/careermap-data';

export default function PaymentSuccessScreen() {
  const { planId, transactionId, method } = useLocalSearchParams<{
    planId?: string;
    transactionId?: string;
    method?: string;
  }>();
  const { activatePlan } = useAppState();
  const plan = subscriptions.find((item) => item.id === planId) ?? subscriptions[0];
  const paymentMethodLabel =
    method === 'upi' ? 'UPI' : method === 'card' ? 'Credit / Debit Card' : method === 'netbanking' ? 'Net Banking' : 'UPI';
  const validUntil = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    if (plan.id) {
      activatePlan(plan.id as 'psychometric' | 'premium' | 'infocentre');
    }
  }, [activatePlan, plan.id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Text style={styles.iconText}>OK</Text>
        </View>
        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.subtitle}>{plan.name} is now active and premium features have been unlocked.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Plan</Text>
            <Text style={styles.detailValue}>{plan.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>{plan.price}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Method</Text>
            <Text style={styles.detailValue}>{paymentMethodLabel}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>{transactionId ?? 'TXN00000000'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Valid Until</Text>
            <Text style={[styles.detailValue, styles.detailValueAccent]}>{validUntil}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Unlocked Now</Text>
          {plan.features.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <Pressable onPress={() => router.replace('/(drawer)/(tabs)/')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, padding: 24, gap: 16, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: `${palette.green}14`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 28, fontWeight: '900', color: palette.green },
  title: { fontSize: 30, fontWeight: '900', color: palette.text, textAlign: 'center' },
  subtitle: { fontSize: 14, lineHeight: 22, color: palette.muted, textAlign: 'center', maxWidth: 280 },
  card: {
    width: '100%',
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: palette.text },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  detailLabel: { fontSize: 12, color: palette.muted },
  detailValue: { fontSize: 12, fontWeight: '800', color: palette.text, flexShrink: 1, textAlign: 'right' },
  detailValueAccent: { color: palette.green },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: palette.green,
  },
  featureText: { fontSize: 13, lineHeight: 20, color: palette.text },
  primaryButton: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: palette.primary,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

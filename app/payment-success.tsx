import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-paper">
      <View className="flex-1 items-center justify-center gap-4 px-6 py-6">
        <View className="h-[84px] w-[84px] items-center justify-center rounded-[28px]" style={{ backgroundColor: `${palette.green}14` }}>
          <Text className="text-[28px] font-black text-success">OK</Text>
        </View>
        <Text className="text-center text-[30px] font-black text-ink">Payment Successful</Text>
        <Text className="max-w-[280px] text-center text-[14px] leading-[22px] text-muted">
          {plan.name} is now active and premium features have been unlocked.
        </Text>

        <View className="w-full gap-2.5 rounded-[22px] border border-line bg-card p-[18px]">
          <Text className="text-[15px] font-extrabold text-ink">Payment Details</Text>
          <View className="flex-row items-center justify-between gap-4">
            <Text className="text-[12px] text-muted">Plan</Text>
            <Text className="shrink text-right text-[12px] font-extrabold text-ink">{plan.name}</Text>
          </View>
          <View className="flex-row items-center justify-between gap-4">
            <Text className="text-[12px] text-muted">Amount</Text>
            <Text className="shrink text-right text-[12px] font-extrabold text-ink">{plan.price}</Text>
          </View>
          <View className="flex-row items-center justify-between gap-4">
            <Text className="text-[12px] text-muted">Method</Text>
            <Text className="shrink text-right text-[12px] font-extrabold text-ink">{paymentMethodLabel}</Text>
          </View>
          <View className="flex-row items-center justify-between gap-4">
            <Text className="text-[12px] text-muted">Transaction ID</Text>
            <Text className="shrink text-right text-[12px] font-extrabold text-ink">{transactionId ?? 'TXN00000000'}</Text>
          </View>
          <View className="flex-row items-center justify-between gap-4">
            <Text className="text-[12px] text-muted">Valid Until</Text>
            <Text className="shrink text-right text-[12px] font-extrabold text-success">{validUntil}</Text>
          </View>
        </View>

        <View className="w-full gap-2.5 rounded-[22px] border border-line bg-card p-[18px]">
          <Text className="text-[15px] font-extrabold text-ink">Unlocked Now</Text>
          {plan.features.map((feature) => (
            <View key={feature} className="flex-row items-center gap-2.5">
              <View className="h-2 w-2 rounded-full bg-success" />
              <Text className="text-[13px] leading-5 text-ink">{feature}</Text>
            </View>
          ))}
        </View>

        <Pressable className="w-full items-center rounded-[18px] bg-brand py-4" onPress={() => router.replace('/(drawer)/(tabs)/')}>
          <Text className="text-[15px] font-extrabold text-white">Go to Dashboard</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

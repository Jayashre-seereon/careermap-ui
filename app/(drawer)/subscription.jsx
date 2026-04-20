import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { palette, subscriptions } from '../../src/careermap-data';
import { AnimatedPressable, Pill, Screen, SectionHeader } from '../../src/careermap-ui';
export default function SubscriptionScreen() {
    const { activePlanId } = useAppState();
    const { returnTo } = useLocalSearchParams();
    return (<Screen>
      <SectionHeader title="Subscription Plans" subtitle="Key plans from the Vercel prototype, adapted here as mobile cards."/>

      <View className="gap-[14px]">
        {subscriptions.map((plan) => (<View key={plan.id} className={`gap-3 rounded-[24px] border bg-card p-[18px] ${plan.recommended ? 'border-[#dcb3a3] shadow-card' : 'border-line'}`}>
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 gap-1.5">
                <Text className="text-[18px] font-black text-ink">{plan.name}</Text>
                <Text className="text-[13px] leading-5 text-muted">{plan.description}</Text>
              </View>
              {plan.recommended ? <Pill label="Recommended" tone={palette.primary}/> : null}
            </View>
            <Text className="text-[28px] font-black text-brand">{plan.price}</Text>
            <View className="gap-2.5">
              {plan.features.map((feature) => (<View key={feature} className="flex-row items-center gap-2.5">
                  <Ionicons name="checkmark-circle" size={18} color={palette.green}/>
                  <Text className="text-[14px] font-semibold text-ink">{feature}</Text>
                </View>))}
            </View>
            <AnimatedPressable className="mt-1 rounded-[14px] py-3" onPress={() => router.push({
                pathname: '/checkout',
                params: {
                    planId: plan.id,
                    ...(returnTo ? { returnTo } : {}),
                },
            })} style={{ backgroundColor: activePlanId === plan.id ? `${palette.green}14` : palette.primary }}>
              <Text className="text-center text-[14px] font-extrabold" style={{ color: activePlanId === plan.id ? palette.green : '#fff' }}>
                {activePlanId === plan.id ? 'Current Plan' : 'Choose Plan'}
              </Text>
            </AnimatedPressable>
          </View>))}
      </View>
    </Screen>);
}

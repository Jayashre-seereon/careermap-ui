import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { getPlans } from '../../src/api/planApi';
import { palette, subscriptions as fallbackSubscriptions } from '../../src/careermap-data';
import { AnimatedPressable, Pill, Screen, SectionHeader } from '../../src/careermap-ui';
export default function SubscriptionScreen() {
    const { activePlanId, preferences } = useAppState();
    const { returnTo } = useLocalSearchParams();
    const [plans, setPlans] = useState(fallbackSubscriptions);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let isMounted = true;
        const loadPlans = async () => {
            try {
                const response = await getPlans();
                if (isMounted && response.length > 0) {
                    setPlans(response);
                }
            }
            catch (error) {
                console.log('Plans fetch failed', error?.response?.data || error?.message || error);
            }
            finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        loadPlans();
        return () => {
            isMounted = false;
        };
    }, []);
    return (<Screen>
      <SectionHeader title="Subscription Plans" subtitle="Key plans from the Vercel prototype, adapted here as mobile cards."/>

      {isLoading ? (<View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color={palette.primary}/>
          <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading plans...</Text>
        </View>) : (<View className="gap-[14px] ">
        {plans.map((plan) => (<View key={plan.id} className={`gap-3 rounded-[24px] border p-[18px] ${plan.recommended || plan.highestseller
  ? preferences.darkMode
      ? 'border-[#3a2028] bg-[#080808]'
      : 'border-[#dcb3a3] bg-card shadow-card'
  : preferences.darkMode
      ? 'border-[#1a1a1a] bg-[#080808]'
      : 'border-line bg-card'}`}>
            <View className="flex-row items-start justify-between gap-3 ">
              <View className="flex-1 gap-1.5">
                <Text className={`text-[18px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{plan.name}</Text>
                <Text className={`text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{plan.description}</Text>
              </View>
              <View className="flex-row gap-2 ">
                {plan.recommended ? <Pill label="Recommended" tone={palette.primary} /> : null}
                {plan.highestseller ? <Pill label="Highest Seller" tone="#f59e0b" /> : null}
              </View>
            </View>
            <View className="gap-1">
              <Text className="text-[28px] font-black text-brand">{plan.price}</Text>
              {plan.validity ? <Text className={`text-[12px] font-bold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{plan.validity}</Text> : null}
            </View>
            <View className="gap-2.5 ">
              {plan.features.map((feature) => (<View key={feature} className="flex-row items-center gap-2.5">
                  <Ionicons name="checkmark-circle" size={18} color={palette.green}/>
                  <Text className={`text-[14px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{feature}</Text>
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
      </View>)}
    </Screen>);
}

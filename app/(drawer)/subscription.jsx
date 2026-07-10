import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { createOrder, getPlans, verifyPayment } from '../../src/api/planApi';
import { palette, subscriptions as fallbackSubscriptions } from '../../src/careermap-data';
import { AnimatedPressable, Pill, Screen, SectionHeader } from '../../src/careermap-ui';
import { openRazorpayCheckout } from '../../src/utils/razorpay';
export default function SubscriptionScreen() {
    const { isCurrentSubscriptionPlan, preferences, userProfile } = useAppState();
    const { returnTo } = useLocalSearchParams();
    const [plans, setPlans] = useState(fallbackSubscriptions);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessingPlan, setIsProcessingPlan] = useState('');
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
    const handleSelectPlan = async (plan) => {
        if (!plan?.id || isProcessingPlan) {
            return;
        }

        try {
            setIsProcessingPlan(plan.id);
            const backendPlanId = plan.apiId || plan.raw?.id || plan.id;
            const orderResponse = await createOrder(plan);
            const order = orderResponse?.order;
            const key = orderResponse?.key;

            if (!order?.id || !key) {
                throw new Error('Failed to initiate Razorpay checkout.');
            }

            const paymentResponse = await openRazorpayCheckout({
                key,
                amount: Number(order.amount),
                currency: order.currency,
                order_id: order.id,
                name: 'CareerMap',
                description: `${plan.name} subscription`,
                prefill: {
                    name: userProfile?.name || '',
                    email: userProfile?.email || '',
                    contact: userProfile?.mobile || '',
                },
                theme: {
                    color: palette.primary,
                },
            });

            await verifyPayment({
                planId: backendPlanId,
                planKey: plan.id,
                razorpay_order_id: paymentResponse?.razorpay_order_id || order.id,
                razorpay_payment_id: paymentResponse?.razorpay_payment_id,
                razorpay_signature: paymentResponse?.razorpay_signature,
            });

            router.replace({
                pathname: '/payment-success',
                params: {
                    planId: plan.id,
                    transactionId: paymentResponse?.razorpay_payment_id || order.id,
                    ...(returnTo ? { returnTo } : {}),
                },
            });
        }
        catch (error) {
            const message = error?.message || error?.response?.data?.message || 'Payment failed. Please try again.';
            if (!/cancelled/i.test(message)) {
                Alert.alert('Payment issue', message);
            }
        }
        finally {
            setIsProcessingPlan('');
        }
    };
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
            <AnimatedPressable
              className="mt-1 rounded-[14px] py-3"
              onPress={() => {
                if (!isCurrentSubscriptionPlan(plan)) {
                  void handleSelectPlan(plan);
                }
              }}
              disabled={isCurrentSubscriptionPlan(plan)}
              style={{ backgroundColor: isCurrentSubscriptionPlan(plan) ? `${palette.green}14` : palette.primary }}
            >
              <Text className="text-center text-[14px] font-extrabold" style={{ color: isCurrentSubscriptionPlan(plan) ? palette.green : '#fff' }}>
                {isProcessingPlan === plan.id ? 'Processing...' : isCurrentSubscriptionPlan(plan) ? 'Current Plan' : 'Choose Plan'}
              </Text>
            </AnimatedPressable>
          </View>))}
      </View>)}
    </Screen>);
}

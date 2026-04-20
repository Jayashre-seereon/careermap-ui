import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/app-state';
import { palette, subscriptions } from '../src/careermap-data';
import { AnimatedPressable } from '../src/careermap-ui';
import { decodeReturnTarget } from '../src/subscription-flow';
export default function PaymentSuccessScreen() {
    const { planId, transactionId, method, returnTo } = useLocalSearchParams();
    const { activatePlan } = useAppState();
    const plan = subscriptions.find((item) => item.id === planId) ?? subscriptions[0];
    const paymentMethodLabel = method === 'upi' ? 'UPI' : method === 'card' ? 'Credit / Debit Card' : method === 'netbanking' ? 'Net Banking' : 'UPI';
    const validUntil = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
    });
    const celebration = useRef(new Animated.Value(0)).current;
    const returnTarget = decodeReturnTarget(returnTo);
    const confetti = [
        { top: 22, left: 30, color: palette.secondary, rotate: '-18deg' },
        { top: 42, right: 26, color: palette.teal, rotate: '16deg' },
        { top: 88, left: 14, color: palette.blue, rotate: '32deg' },
        { top: 102, right: 18, color: palette.orange, rotate: '-28deg' },
        { bottom: 110, left: 22, color: palette.pink, rotate: '18deg' },
        { bottom: 124, right: 28, color: palette.green, rotate: '-14deg' },
    ];
    useEffect(() => {
        if (plan.id) {
            activatePlan(plan.id);
        }
    }, [activatePlan, plan.id]);
    useEffect(() => {
        Animated.spring(celebration, {
            toValue: 1,
            useNativeDriver: true,
            speed: 12,
            bounciness: 10,
        }).start();
    }, [celebration]);
    const handleContinue = () => {
        if (returnTarget) {
            router.replace(returnTarget);
            return;
        }
        router.replace('/(drawer)/(tabs)/');
    };
    return (<SafeAreaView className="flex-1 bg-paper">
      <View className="flex-1 items-center justify-center gap-4 overflow-hidden px-6 py-6">
        {confetti.map((piece, index) => (<Animated.View key={index} className="absolute h-4 w-4 rounded-[4px]" style={[
                piece,
                {
                    backgroundColor: piece.color,
                    transform: [
                        { translateY: celebration.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) },
                        { scale: celebration.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
                        { rotate: piece.rotate },
                    ],
                    opacity: celebration.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                },
            ]}/>))}
        <Animated.View style={{
                transform: [{ scale: celebration.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
                opacity: celebration,
            }}>
          <View className="h-[108px] w-[108px] items-center justify-center rounded-[34px] border border-[#d7f0e1]" style={{ backgroundColor: `${palette.green}14` }}>
            <Text className="text-[38px] font-black text-success">OK</Text>
          </View>
        </Animated.View>
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
          {plan.features.map((feature) => (<View key={feature} className="flex-row items-center gap-2.5">
              <View className="h-2 w-2 rounded-full bg-success"/>
              <Text className="text-[13px] leading-5 text-ink">{feature}</Text>
            </View>))}
        </View>

        <AnimatedPressable className="w-full items-center rounded-[18px] bg-brand px-4 py-3" onPress={handleContinue}>
          <Text className="text-[15px] font-extrabold text-white">{returnTarget ? 'Back to Your Page' : 'Go to Dashboard'}</Text>
        </AnimatedPressable>
      </View>
    </SafeAreaView>);
}

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
    useEffect(() => {
        const timer = setTimeout(() => {
            if (returnTarget) {
                router.replace(returnTarget);
                return;
            }
            router.replace('/(drawer)/(tabs)/');
        }, 3000);
        return () => clearTimeout(timer);
    }, [returnTarget]);
    const handleContinue = () => {
        if (returnTarget) {
            router.replace(returnTarget);
            return;
        }
        router.replace('/(drawer)/(tabs)/');
    };
    const fullScreenConfetti = Array.from({ length: 56 }, (_, index) => ({
        top: `${4 + (index % 8) * 11}%`,
        left: `${4 + (index * 9) % 92}%`,
        color: [palette.secondary, palette.teal, palette.blue, palette.orange, palette.pink, palette.green, palette.primary][index % 7],
        rotate: `${(index % 2 === 0 ? -1 : 1) * (10 + (index % 5) * 10)}deg`,
    }));
    return (<SafeAreaView className="flex-1 bg-paper">
      <View className="flex-1 items-center justify-center gap-4 overflow-hidden px-6 py-6">
        <Animated.View className="absolute inset-0" style={{
                opacity: celebration.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 1] }),
                transform: [{ scale: celebration.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
            }}>
          <View className="absolute inset-0 bg-[#fff7ef]"/>
          <View className="absolute left-[-20%] top-[10%] h-[240px] w-[240px] rounded-full bg-[#ffd7df]/60"/>
          <View className="absolute right-[-18%] top-[18%] h-[220px] w-[220px] rounded-full bg-[#dff7ea]/75"/>
          <View className="absolute bottom-[6%] left-[12%] h-[210px] w-[210px] rounded-full bg-[#dfeaff]/65"/>
          <View className="absolute bottom-[-8%] right-[6%] h-[230px] w-[230px] rounded-full bg-[#fff0d6]/80"/>
        </Animated.View>
        {fullScreenConfetti.map((piece, index) => (<Animated.View key={`blast-${index}`} className="absolute h-3 w-3 rounded-[3px]" style={{
                top: piece.top,
                left: piece.left,
                backgroundColor: piece.color,
                opacity: celebration.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 1] }),
                transform: [
                    { translateY: celebration.interpolate({ inputRange: [0, 1], outputRange: [-180, 260] }) },
                    { translateX: celebration.interpolate({ inputRange: [0, 1], outputRange: [0, (index % 2 === 0 ? -1 : 1) * (30 + (index % 6) * 12)] }) },
                    { rotate: piece.rotate },
                    { scale: celebration.interpolate({ inputRange: [0, 0.18, 1], outputRange: [0.15, 1.15, 0.9] }) },
                ],
            }}/>))}
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
          <View className="h-[118px] w-[118px] items-center justify-center rounded-[38px] border-2 border-[#d7f0e1]" style={{ backgroundColor: `${palette.green}14` }}>
            <Text className="text-[40px] font-black text-success">OK</Text>
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
          <Text className="text-[15px] font-extrabold text-white">{returnTarget ? 'Returning to previous page...' : 'Go to Dashboard'}</Text>
        </AnimatedPressable>
      </View>
    </SafeAreaView>);
}

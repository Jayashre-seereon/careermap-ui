import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/app-state';
import { AnimatedBackground } from '../src/animated-background';
import { palette, subscriptions } from '../src/careermap-data';
import { AnimatedPressable } from '../src/careermap-ui';
import { decodeReturnTarget } from '../src/subscription-flow';

export default function PaymentSuccessScreen() {
  const { planId, transactionId, returnTo } = useLocalSearchParams();
  const { activatePlan, preferences } = useAppState();
  const celebration = useRef(new Animated.Value(0)).current;

  const plan =
    subscriptions.find((item) => item.id === planId) ??
    subscriptions[0];

  const returnTarget = decodeReturnTarget(returnTo);

  const validUntil = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  ).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  const themed = {
    pageOverlay: preferences.darkMode ? 'rgba(5, 5, 5, 0.86)' : 'rgba(251, 247, 243, 0.82)',
    card: preferences.darkMode ? 'rgba(8, 8, 8, 0.94)' : 'rgba(255, 255, 255, 0.9)',
    border: preferences.darkMode ? '#1a1a1a' : palette.border,
    text: preferences.darkMode ? '#fff' : palette.text,
    muted: preferences.darkMode ? '#aaa' : palette.muted,
    successSurface: preferences.darkMode ? 'rgba(47, 147, 103, 0.16)' : `${palette.green}16`,
    heroSurface: preferences.darkMode ? 'rgba(8, 8, 8, 0.94)' : 'rgba(246, 239, 235, 0.9)',
  };

  // activate plan
  useEffect(() => {
    if (plan.id) {
      activatePlan(plan.id);
    }
  }, [activatePlan, plan.id]);

  // animation
  useEffect(() => {
    Animated.spring(celebration, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  // auto redirect
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <AnimatedBackground />
      <View className="flex-1">
      <View className="flex-1 justify-center gap-4 px-4 py-4">
        <View
          className="items-center justify-center rounded-[28px] px-6 py-8"
         
        >
          <Animated.View
            style={{
              transform: [
                {
                  scale: celebration.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                  }),
                },
              ],
              opacity: celebration,
            }}
          >
            <View
              className="items-center justify-center"
              style={{
                height: 92,
                width: 92,
                borderRadius: 46,
                backgroundColor: themed.successSurface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark" size={42} color={palette.green} />
            </View>
          </Animated.View>

          <Text
            className="mt-[18px] text-center text-[26px] font-extrabold"
            style={{
              color: themed.text,
            }}
          >
            Payment Successful!
          </Text>

          <Text
            className="mt-2 text-center text-[14px] leading-[21px]"
            style={{
              color: themed.muted,
            }}
          >
            Your subscription is now active and ready to use.
          </Text>

          <Text
            className="mt-[10px] text-center text-[16px] font-bold"
            style={{
              color: palette.primary,
            }}
          >
            {plan.name}
          </Text>
        </View>

        <View
          className="rounded-[14px] border p-4"
          style={{
            backgroundColor: themed.card,
            borderColor: themed.border,
          }}
        >
          {[
            ['Plan', plan.name],
            ['Amount', plan.price],
            ['Transaction ID', transactionId ?? 'TXN00000000'],
            ['Validity', `1 Year (until ${validUntil})`],
          ].map(([label, value], i) => (
            <View
              key={label}
              className="flex-row justify-between py-[6px]"
              style={{
                borderBottomWidth: i !== 3 ? 1 : 0,
                borderColor: themed.border,
              }}
            >
              <Text className="text-[12px]" style={{ color: themed.muted }}>
                {label}
              </Text>
              <Text
                className="max-w-[60%] text-right text-[12px] font-bold"
                style={{
                  color:
                    label === 'Validity'
                      ? palette.green
                      : themed.text,
                }}
              >
                {value}
              </Text>
            </View>
          ))}
        </View>

        <AnimatedPressable onPress={handleContinue}>
          <LinearGradient
            colors={[palette.primary, '#a30f2d']}
            className="mt-2 rounded-[12px] py-[14px]"
            style={{
              borderRadius: 12,
            }}
          >
            <Text className="text-center text-[15px] font-bold text-white">
              Continue
            </Text>
          </LinearGradient>
        </AnimatedPressable>
      </View>
      </View>
    </SafeAreaView>
  );
}

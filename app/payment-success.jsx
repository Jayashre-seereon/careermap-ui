import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/app-state';
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
    page: preferences.darkMode ? '#000' : '#ffffff',
    card: preferences.darkMode ? '#0d1014' : '#ffffff',
    border: preferences.darkMode ? '#1a1a1a' : '#eee',
    text: preferences.darkMode ? '#fff' : palette.text,
    muted: preferences.darkMode ? '#aaa' : palette.muted,
    successSurface: preferences.darkMode ? '#102217' : '#e9f7ef',
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
    <SafeAreaView style={{ flex: 1, backgroundColor: themed.page }}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'space-between' }}>

        {/* TOP */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>

          {/* Tick */}
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
              style={{
                height: 80,
                width: 80,
                borderRadius: 50,
                backgroundColor: themed.successSurface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark" size={38} color={palette.green} />
            </View>
          </Animated.View>

          {/* Title */}
          <Text
            style={{
              marginTop: 14,
              fontSize: 22,
              fontWeight: '800',
              color: themed.text,
            }}
          >
            Payment Successful!
          </Text>

          {/* Subtitle */}
          <Text style={{ marginTop: 4, color: themed.muted, fontSize: 13 }}>
            Your subscription to
          </Text>

          <Text
            style={{
              marginTop: 2,
              color: palette.primary,
              fontWeight: '700',
            }}
          >
            {plan.name}
          </Text>
        </View>

        {/* CARD */}
        <View
          style={{
            borderRadius: 14,
            padding: 14,
            backgroundColor: themed.card,
            borderWidth: 1,
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
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 6,
                borderBottomWidth: i !== 3 ? 1 : 0,
                borderColor: themed.border,
              }}
            >
              <Text style={{ color: themed.muted, fontSize: 12 }}>
                {label}
              </Text>
              <Text
                style={{
                  color:
                    label === 'Validity'
                      ? palette.green
                      : themed.text,
                  fontWeight: '700',
                  fontSize: 12,
                  maxWidth: '60%',
                  textAlign: 'right',
                }}
              >
                {value}
              </Text>
            </View>
          ))}
        </View>

        {/* BUTTON */}
        <AnimatedPressable onPress={handleContinue}>
          <LinearGradient
            colors={[palette.primary, '#a30f2d']}
            style={{
              paddingVertical: 14,
              borderRadius: 12,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: '#fff',
                fontWeight: '700',
                fontSize: 15,
              }}
            >
              Continue
            </Text>
          </LinearGradient>
        </AnimatedPressable>

      </View>
    </SafeAreaView>
  );
}
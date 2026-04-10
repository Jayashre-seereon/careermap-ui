import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BeeMascot } from '../src/bee-mascot';

export default function AuthEntryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="flex-1 px-6 py-6">
        <View className="flex-1 items-center justify-center gap-5">
          <View className="h-[96px] w-[96px] items-center justify-center rounded-[30px] bg-card">
            <BeeMascot size={70} />
          </View>
          <View className="items-center gap-2">
            <Text className="text-center text-[30px] font-black text-ink">Welcome to Career Map</Text>
            <Text className="max-w-[300px] text-center text-[14px] leading-[22px] text-muted">
              Choose how you want to continue.
            </Text>
          </View>
          <View className="w-full gap-4">
            <Pressable className="rounded-[24px] border border-line bg-card p-5" onPress={() => router.push('/onboarding')}>
              <View className="flex-row items-center gap-4">
                <View className="h-14 w-14 items-center justify-center rounded-[18px] bg-brand">
                  <Ionicons name="person-add-outline" size={26} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="text-[18px] font-extrabold text-ink">New User</Text>
                  <Text className="mt-1 text-[12px] leading-5 text-muted">Start onboarding and create your profile.</Text>
                </View>
              </View>
            </Pressable>
            <Pressable className="rounded-[24px] border border-line bg-card p-5" onPress={() => router.push({ pathname: '/login', params: { userType: 'existing' } })}>
              <View className="flex-row items-center gap-4">
                <View className="h-14 w-14 items-center justify-center rounded-[18px] bg-surface">
                  <Ionicons name="log-in-outline" size={26} color="#c11e38" />
                </View>
                <View className="flex-1">
                  <Text className="text-[18px] font-extrabold text-ink">Existing User</Text>
                  <Text className="mt-1 text-[12px] leading-5 text-muted">Login with OTP, coupon, or email and password.</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

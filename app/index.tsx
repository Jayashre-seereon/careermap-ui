import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { BeeMascot } from '../src/bee-mascot';

export default function SplashRoute() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/auth-entry'), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center overflow-hidden bg-brand px-6">
      <View className="absolute right-[-40px] top-[72px] h-[180px] w-[180px] rounded-full bg-white/10" />
      <View className="absolute bottom-[-50px] left-[-60px] h-[240px] w-[240px] rounded-full bg-white/10" />
      <View className="mb-6 h-[108px] w-[108px] items-center justify-center rounded-[32px] bg-white">
        <BeeMascot size={76} />
      </View>
      <Text className="text-center text-[38px] font-black text-white">Career Map</Text>
      <Text className="mt-2 text-[16px] text-white/75">Discover Your Future</Text>
      <View className="mt-7 h-[6px] w-32 overflow-hidden rounded-full bg-white/20">
        <View className="h-full w-full rounded-full bg-white/70" />
      </View>
    </View>
  );
}

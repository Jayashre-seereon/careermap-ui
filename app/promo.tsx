import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BeeMascot } from '../src/bee-mascot';

const features = [
  { title: 'Career Library', desc: '500+ career options across streams' },
  { title: 'Psychometric Tests', desc: 'Discover strengths and ideal fit' },
  { title: 'Expert Mentors', desc: 'Guidance from counsellors and experts' },
  { title: 'Scholarships & Exams', desc: 'Stay updated on opportunities' },
  { title: 'Study Abroad', desc: 'Explore international education paths' },
];

export default function PromoScreen() {
  const [page, setPage] = useState(0);

  if (page === 0) {
    return (
      <SafeAreaView className="flex-1 bg-paper">
        <View className="flex-1 items-center justify-center gap-[18px] overflow-hidden bg-brand px-6">
          <Pressable className="absolute right-[18px] top-[18px] z-10 h-[34px] w-[34px] items-center justify-center rounded-full bg-white/20" onPress={() => router.replace('/(drawer)')}>
            <Text className="text-[13px] font-black text-white">X</Text>
          </Pressable>
          <View className="absolute right-[-70px] top-20 h-[220px] w-[220px] rounded-full bg-white/10" />
          <View className="absolute bottom-[-80px] left-[-80px] h-[260px] w-[260px] rounded-full bg-white/10" />
          <View className="h-[104px] w-[104px] items-center justify-center rounded-[30px] bg-white">
            <BeeMascot size={86} />
          </View>
          <Text className="text-center text-[36px] font-black text-white">Career Map</Text>
          <Text className="text-center text-[18px] text-white/80">Discover Your Future</Text>
          <Text className="max-w-[280px] text-center text-[14px] leading-[22px] text-white/65">
            India&apos;s most comprehensive career guidance platform for students and parents.
          </Text>
          <View className="mt-1 flex-row gap-2 self-center">
            <View className="h-2 w-7 rounded-full bg-white" />
            <View className="h-2 w-2 rounded-full bg-black/20" />
          </View>
          <Pressable className="self-stretch rounded-[18px] bg-white py-4" onPress={() => setPage(1)}>
            <Text className="text-center text-[15px] font-extrabold text-brand">Next</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="flex-1 justify-center gap-[18px] px-6">
        <Text className="text-center text-[30px] font-black text-ink">What You Can Explore</Text>
        <Text className="mb-1.5 text-center text-[14px] text-muted">Everything you need for career guidance</Text>
        <View className="gap-3">
          {features.map((feature) => (
            <View key={feature.title} className="gap-1 rounded-[20px] border border-line bg-card p-4">
              <Text className="text-[15px] font-extrabold text-ink">{feature.title}</Text>
              <Text className="text-[12px] leading-[18px] text-muted">{feature.desc}</Text>
            </View>
          ))}
        </View>
        <View className="mt-1 flex-row gap-2 self-center">
          <View className="h-2 w-2 rounded-full bg-black/20" />
          <View className="h-2 w-7 rounded-full bg-brand" />
        </View>
        <Pressable className="rounded-[18px] bg-brand py-4" onPress={() => router.replace('/(drawer)')}>
          <Text className="text-center text-[15px] font-extrabold text-white">Explore the App</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

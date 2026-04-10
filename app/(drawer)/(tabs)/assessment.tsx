import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useAppState } from '../../../src/app-state';
import { assessmentFeatures, assessmentPolicies, palette } from '../../../src/careermap-data';
import { Screen, SectionHeader } from '../../../src/careermap-ui';

export default function AssessmentScreen() {
  const { isUnlocked } = useAppState();
  const unlocked = isUnlocked('psychometric-test');

  return (
    <Screen>
      <SectionHeader
        title="Career Assessment"
        subtitle="The mobile equivalent of the web prototype's full psychometric test entry screen."
      />

      <View className="items-center gap-2.5 rounded-[28px] border border-line bg-card p-[22px]">
        <View className="h-20 w-20 items-center justify-center rounded-[24px]" style={{ backgroundColor: `${palette.primary}12` }}>
          <Text className="text-[24px] font-black text-brand">AI</Text>
        </View>
        <Text className="text-center text-[24px] font-black text-ink">Full Psychometric Test</Text>
        <Text className="text-center text-[14px] leading-[22px] text-muted">
          A comprehensive assessment to discover aptitude, personality traits, and the careers that fit you best.
        </Text>
        <Pressable
          onPress={() =>
            unlocked
              ? router.push('/(drawer)/psychometric-test')
              : router.push({ pathname: '/checkout', params: { planId: 'psychometric' } })
          }
          className="mt-1 rounded-full bg-brand px-[18px] py-3"
        >
          <Text className="text-[14px] font-extrabold text-white">{unlocked ? 'Open Psychometric Test' : 'Subscribe to Unlock Full Test'}</Text>
        </Pressable>
      </View>

      <View className="gap-3 rounded-[24px] border border-line bg-card p-[18px]">
        <Text className="text-[16px] font-extrabold text-ink">Test Features</Text>
        <View className="gap-2.5">
          {assessmentFeatures.map((feature) => (
            <View key={feature} className="flex-row items-center gap-2.5">
              <View className="h-[10px] w-[10px] rounded-full bg-success" />
              <Text className="flex-1 text-[14px] text-ink">{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-3 rounded-[24px] border border-line bg-[#fff8f8] p-[18px]">
        <Text className="text-[16px] font-extrabold text-ink">Test Policy</Text>
        <View className="gap-2.5">
          {assessmentPolicies.map((policy) => (
            <Text key={policy} className="text-[13px] leading-5 text-muted">
              - {policy}
            </Text>
          ))}
        </View>
      </View>

      <View className="gap-3 rounded-[24px] border border-line bg-card p-[18px]">
        <Text className="text-[16px] font-extrabold text-ink">Practice Routes</Text>
        <View className="gap-2.5">
          <Pressable className="items-center rounded-[14px] bg-brand py-3" onPress={() => router.push('/(drawer)/quiz')}>
            <Text className="text-[13px] font-extrabold text-white">Open Quiz Practice</Text>
          </Pressable>
          <Pressable className="items-center rounded-[14px] py-3" onPress={() => router.push('/(drawer)/abroad')} style={{ backgroundColor: `${palette.blue}12` }}>
            <Text className="text-[13px] font-extrabold" style={{ color: palette.blue }}>Explore Study Abroad</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

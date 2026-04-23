import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useAppState } from '../../../src/app-state';
import { assessmentFeatures, assessmentPolicies, palette, subscriptions } from '../../../src/careermap-data';
import { AnimatedPressable, Screen } from '../../../src/careermap-ui';
export default function AssessmentScreen() {
    const { activePlanId, isUnlocked, preferences } = useAppState();
    const testUnlocked = isUnlocked('psychometric-test');
    const psychometricPlan = subscriptions.find((plan) => plan.id === 'psychometric');
    return (<Screen>
      <View className="px-1 pb-8 pt-3">
        <View className="mb-7 flex-row items-center gap-3">
          <AnimatedPressable onPress={() => (router.canGoBack() ? router.back() : router.push('/(drawer)/(tabs)/library'))} className={`h-10 w-10 items-center justify-center rounded-full ${preferences.darkMode ? 'bg-[#211927]' : 'bg-white'}`} style={{
            shadowColor: '#967c75',
            shadowOpacity: 0.12,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
        }}>
            <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
          </AnimatedPressable>
          <Text className={`text-[22px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Career Assessment</Text>
        </View>

        <View className="items-center pb-4">
          <View className="mb-4 h-[84px] w-[84px] items-center justify-center rounded-[26px] bg-[#ffecef]">
            <Ionicons name="analytics-outline" size={34} color={palette.primary}/>
          </View>
          <Text className={`text-center text-[32px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Full Psychometric Test</Text>
          <Text className={`mt-2 text-center text-[15px] leading-6 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
            A comprehensive assessment to understand aptitude, personality traits, and the right-fit career direction.
          </Text>

          <View className="mt-4 flex-row gap-2">
            <View className="rounded-full bg-[#e8f2ff] px-3 py-1.5">
              <Text className="text-[11px] font-bold text-[#3774d8]">50 Questions</Text>
            </View>
            <View className="rounded-full bg-[#e4f7ed] px-3 py-1.5">
              <Text className="text-[11px] font-bold text-[#2f9367]">1 Year Validity</Text>
            </View>
          </View>
        </View>

        <View className="gap-4">
          <View className={`rounded-[24px] border px-4 py-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-[#e8dfda] bg-card'}`}>
            <Text className="mb-3 text-[17px] font-extrabold text-brand">Test Features</Text>
            <View className="gap-2">
              {assessmentFeatures.map((feature) => (<View key={feature} className={`flex-row items-center gap-3 rounded-[16px] px-3 py-3 ${preferences.darkMode ? 'bg-[#141417]' : 'bg-[#fff8f5]'}`}>
                  <View className="h-5 w-5 items-center justify-center rounded-full bg-[#dff3e9]">
                    <Ionicons name="checkmark" size={12} color={palette.green}/>
                  </View>
                  <Text className={`flex-1 text-[14px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{feature}</Text>
                </View>))}
            </View>
          </View>

          <View className={`rounded-[24px] border px-4 py-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-[#e8dfda] bg-card'}`}>
            <Text className="mb-3 text-[17px] font-extrabold text-brand">Test Policy</Text>
            <View className="gap-3">
              {assessmentPolicies.map((item) => (<View key={item} className="flex-row items-start gap-3">
                  <View className="mt-[7px] h-[6px] w-[6px] rounded-full bg-brand"/>
                  <Text className={`flex-1 text-[14px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item}</Text>
                </View>))}
            </View>
          </View>

          {!testUnlocked ? (<View className={`rounded-[24px] border px-4 py-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-[#e8dfda] bg-card'}`}>
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-[17px] font-extrabold text-brand">Unlock Test</Text>
                <Ionicons name="lock-closed" size={18} color={palette.muted}/>
              </View>
              <Text className={`text-[14px] leading-6 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                Subscribe to the {psychometricPlan?.name ?? 'Psychometric Test'} plan to take the full assessment and unlock the report flow.
              </Text>
           <AnimatedPressable onPress={() => router.push('/(drawer)/subscription')} className="mt-3 w-full self-center rounded-full bg-brand px-5 py-2.5 items-center justify-center">
  <Text className="text-[13px] font-extrabold text-white text-center">
    View Plans
  </Text>
        </AnimatedPressable>
            </View>) : null}

          <AnimatedPressable onPress={() => (testUnlocked ? router.push('/(drawer)/psychometric-test') : router.push('/(drawer)/subscription'))} className="mt-1 rounded-[18px] px-5 py-4" style={{
            backgroundColor: testUnlocked ? palette.primary : '#d7cbc5',
            shadowColor: '#711628',
            shadowOpacity: 0.22,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 4,
        }}>
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name={testUnlocked ? 'play-outline' : 'lock-closed-outline'} size={18} color="#ffffff"/>
              <Text className="text-[18px] font-extrabold text-white">
                {testUnlocked ? 'Start Full Test' : 'Subscribe to Take Test'}
              </Text>
            </View>
          </AnimatedPressable>

          <View className={`rounded-[18px] px-4 py-4 ${preferences.darkMode ? 'bg-[#211927]' : 'bg-[#fff7f3]'}`}>
            <Text className="text-[12px] font-bold uppercase tracking-[0.8px] text-brand">Status</Text>
            <Text className={`mt-1 text-[15px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
              {activePlanId ? 'Your subscription is active.' : 'No active test plan yet.'}
            </Text>
            <Text className={`mt-1 text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
              {activePlanId
            ? 'You can proceed with the psychometric flow and view updated results in your profile history.'
            : 'Choose a plan to unlock one full psychometric attempt and the related career report.'}
            </Text>
          </View>
        </View>
      </View>
    </Screen>);
}

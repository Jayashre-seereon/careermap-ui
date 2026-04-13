import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Text, View } from 'react-native';

import { BeeMascot } from '../../src/bee-mascot';
import { entranceExams, palette } from '../../src/careermap-data';
import { AnimatedPressable, Screen } from '../../src/careermap-ui';

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      className="rounded-[24px] border bg-card px-4 py-4"
      style={{
        borderColor: '#e8dfda',
        shadowColor: '#7c5f54',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
      }}
    >
      <Text className="mb-3 text-[17px] font-extrabold text-brand">{title}</Text>
      {children}
    </View>
  );
}

export default function EntranceExamDetailScreen() {
  const { examId } = useLocalSearchParams<{ examId?: string }>();
  const exam = entranceExams.find((item) => item.id === examId) ?? entranceExams[0];
  const examDetails = [
    { label: 'Exam Date', value: exam.date },
    { label: 'Mode', value: exam.mode },
    { label: 'Duration', value: exam.duration },
    { label: 'Subjects', value: exam.subjects },
    { label: 'Total Marks', value: exam.totalMarks },
    { label: 'Frequency', value: exam.frequency },
    { label: 'Eligibility', value: exam.eligibility },
  ];

  return (
    <Screen>
      <View className="overflow-hidden rounded-[34px] bg-[#fcf8f5] px-4 pb-8 pt-3">
        <View className="absolute left-[-32px] top-[92px] h-[120px] w-[120px] rounded-full bg-[#fff1f2]" />
        <View className="absolute right-[-18px] top-[40px] h-[130px] w-[130px] rounded-full bg-[#fff6f1]" />
        <View className="absolute left-[38px] top-[210px] h-3 w-3 rounded-full bg-[#d8f1e7]" />
        <View className="absolute left-[66px] top-[270px] h-4 w-4 rotate-12 rounded-[4px] bg-[#efe8ff]" />
        <View className="absolute right-[88px] top-[126px] h-4 w-4 rounded-full bg-[#f8d8de]" />
        <View className="absolute right-[54px] top-[178px] h-[7px] w-[7px] rounded-full bg-[#d7ecea]" />
        <View className="absolute right-[28px] top-[226px] h-[18px] w-[3px] rotate-45 rounded-full bg-[#f8e4d4]" />
        <View className="absolute right-[54px] top-[288px] h-[10px] w-[10px] rounded-[3px] bg-[#eef5ef]" />

        <View className="mb-7 flex-row items-center gap-3">
          <AnimatedPressable
            onPress={() => (router.canGoBack() ? router.back() : router.push('/(drawer)/entrance-exam'))}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            style={{
              shadowColor: '#967c75',
              shadowOpacity: 0.12,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          >
            <Ionicons name="arrow-back" size={18} color={palette.text} />
          </AnimatedPressable>
          <Text className="text-[22px] font-extrabold text-ink">{exam.name}</Text>
        </View>

        <View className="items-center pb-4">
          <View className="mb-4 h-[84px] w-[84px] items-center justify-center rounded-[26px] bg-[#ffecef]">
            <Ionicons name="document-text-outline" size={34} color={palette.primary} />
          </View>
          <Text className="text-center text-[32px] font-black text-ink">{exam.name}</Text>
          <Text className="mt-1 text-[18px] font-medium text-muted">{exam.authority}</Text>

          <View className="mt-4 flex-row gap-2">
            <View className="rounded-full bg-[#e8f2ff] px-3 py-1.5">
              <Text className="text-[11px] font-bold text-[#3774d8]">{exam.type}</Text>
            </View>
            <View className="rounded-full bg-[#e4f7ed] px-3 py-1.5">
              <Text className="text-[11px] font-bold text-[#2f9367]">{exam.category}</Text>
            </View>
          </View>
        </View>

        <View className="gap-4">
          <DetailCard title="About">
            <Text className="text-[14px] leading-6 text-muted">{exam.about}</Text>
          </DetailCard>

          <DetailCard title="Exam Details">
            <View className="gap-0.5">
              {examDetails.map((item, index) => (
                <View key={item.label}>
                  <View className="flex-row items-start justify-between gap-4 py-3">
                    <Text className="flex-1 text-[14px] text-muted">{item.label}</Text>
                    <Text className="max-w-[58%] text-right text-[14px] font-bold leading-5 text-ink">{item.value}</Text>
                  </View>
                  {index < examDetails.length - 1 ? <View className="h-px bg-[#f0e8e2]" /> : null}
                </View>
              ))}
            </View>
          </DetailCard>

          <DetailCard title="Exam Pattern">
            <View className="gap-3">
              {exam.examPattern.map((item) => (
                <View key={item} className="flex-row items-start gap-3">
                  <View className="mt-[7px] h-[6px] w-[6px] rounded-full bg-brand" />
                  <Text className="flex-1 text-[14px] leading-5 text-muted">{item}</Text>
                </View>
              ))}
            </View>
          </DetailCard>

          <DetailCard title="Top Colleges">
            <View className="flex-row flex-wrap gap-x-5 gap-y-3">
              {exam.topColleges.map((college) => (
                <Text key={college} className="text-[14px] font-semibold text-brand">
                  {college}
                </Text>
              ))}
            </View>
          </DetailCard>

          <AnimatedPressable
            onPress={() => WebBrowser.openBrowserAsync(exam.website)}
            className="mt-1 rounded-[18px] px-5 py-4"
            style={{
              backgroundColor: palette.primary,
              shadowColor: '#711628',
              shadowOpacity: 0.22,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 4,
            }}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="open-outline" size={18} color="#ffffff" />
              <Text className="text-[18px] font-extrabold text-white">Visit Official Website</Text>
            </View>
          </AnimatedPressable>
        </View>

        <View className="absolute bottom-7 right-4">
          <BeeMascot size={58} />
        </View>
      </View>
    </Screen>
  );
}

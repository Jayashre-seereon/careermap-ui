import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';
import { Screen, SectionHeader } from '../../src/careermap-ui';

const questions = [
  { q: 'I enjoy working with numbers and data.', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'] },
  { q: 'I prefer creative tasks over analytical ones.', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'] },
  { q: 'I like helping and mentoring others.', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'] },
  { q: 'I am interested in how businesses operate.', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'] },
  { q: 'I enjoy learning about technology and gadgets.', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'] },
];

export default function PsychometricTestScreen() {
  const { addTestHistory, isUnlocked } = useAppState();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [completed, setCompleted] = useState(false);

  if (!isUnlocked('psychometric-test')) {
    return (
      <Screen>
        <SectionHeader title="Psychometric Test Locked" subtitle="This full assessment unlocks after subscription payment." />
        <View className="items-center gap-3 rounded-[28px] border border-line bg-card p-[22px]">
          <Text className="text-center text-[18px] font-extrabold text-ink">Subscribe to continue with the full psychometric test.</Text>
          <Text className="text-center text-[14px] leading-[22px] text-muted">Choose a plan and complete the mock payment flow to unlock this feature.</Text>
          <Pressable className="rounded-[16px] bg-brand px-5 py-3" onPress={() => router.push({ pathname: '/checkout', params: { planId: 'psychometric' } })}>
            <Text className="text-[14px] font-extrabold text-white">Unlock Full Test</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const select = (option: string) => {
    const next = [...answers];
    next[current] = option;
    setAnswers(next);
  };

  if (completed) {
    return (
      <Screen>
        <SectionHeader title="Psychometric Result" subtitle="A simplified mobile result inspired by the web prototype." />
        <View className="items-center gap-3 rounded-[28px] border border-line bg-card p-[22px]">
          <Text className="text-[42px] font-black text-brand">84%</Text>
          <Text className="text-center text-[18px] font-extrabold text-ink">Strong match for analytical and technology-focused roles.</Text>
          <Text className="text-center text-[14px] leading-[22px] text-muted">
            The full web prototype shows a more detailed report. This mobile version keeps the same core flow.
          </Text>
          <Pressable className="rounded-[16px] bg-brand px-5 py-3" onPress={() => router.push('/(drawer)/subscription')}>
            <Text className="text-[14px] font-extrabold text-white">Get Detailed Report</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Psychometric Test"
        subtitle={`Question ${current + 1} of ${questions.length}`}
        action={<Text className="text-[12px] font-extrabold text-brand">{Math.round(((current + 1) / questions.length) * 100)}%</Text>}
      />

      <View className="rounded-[24px] border border-line bg-card p-5">
        <Text className="text-[19px] font-extrabold leading-7 text-ink">{questions[current].q}</Text>
      </View>

      <View className="gap-3">
        {questions[current].options.map((option) => {
          const active = answers[current] === option;
          return (
            <Pressable key={option} className={`rounded-[18px] border px-4 py-[15px] ${active ? 'border-brand bg-brand' : 'border-line bg-card'}`} onPress={() => select(option)}>
              <Text className={`text-[14px] font-bold ${active ? 'text-white' : 'text-ink'}`}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row gap-3">
        <Pressable
          className="flex-1 items-center rounded-[16px] border border-line bg-card py-[14px]"
          disabled={current === 0}
          onPress={() => setCurrent((value) => value - 1)}
          style={({ pressed }) => ({ opacity: current === 0 || pressed ? 0.45 : 1 })}
        >
          <Text className={`text-[14px] font-extrabold ${current === 0 ? 'text-muted' : 'text-ink'}`}>Previous</Text>
        </Pressable>
        {current < questions.length - 1 ? (
          <Pressable
            className="flex-1 items-center rounded-[16px] bg-brand py-[14px]"
            disabled={!answers[current]}
            onPress={() => setCurrent((value) => value + 1)}
            style={({ pressed }) => ({ opacity: !answers[current] || pressed ? 0.45 : 1 })}
          >
            <Text className="text-[14px] font-extrabold text-white">Next</Text>
          </Pressable>
        ) : (
          <Pressable
            className="flex-1 items-center rounded-[16px] bg-brand py-[14px]"
            disabled={!answers[current]}
            onPress={() => {
              addTestHistory({
                id: `psychometric-${Date.now()}`,
                title: 'Psychometric Test',
                subtitle: `Completed on ${new Date().toLocaleDateString('en-IN')}`,
                status: 'Completed',
              });
              setCompleted(true);
            }}
            style={({ pressed }) => ({ opacity: !answers[current] || pressed ? 0.45 : 1 })}
          >
            <Text className="text-[14px] font-extrabold text-white">Finish Test</Text>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}

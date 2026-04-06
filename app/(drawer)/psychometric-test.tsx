import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  const { isUnlocked } = useAppState();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [completed, setCompleted] = useState(false);

  if (!isUnlocked('psychometric-test')) {
    return (
      <Screen>
        <SectionHeader title="Psychometric Test Locked" subtitle="This full assessment unlocks after subscription payment." />
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Subscribe to continue with the full psychometric test.</Text>
          <Text style={styles.resultCopy}>Choose a plan and complete the mock payment flow to unlock this feature.</Text>
          <Pressable onPress={() => router.push({ pathname: '/checkout', params: { planId: 'psychometric' } })} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Unlock Full Test</Text>
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
        <View style={styles.resultCard}>
          <Text style={styles.resultScore}>84%</Text>
          <Text style={styles.resultTitle}>Strong match for analytical and technology-focused roles.</Text>
          <Text style={styles.resultCopy}>
            The full web prototype shows a more detailed report. This mobile version keeps the same core flow.
          </Text>
          <Pressable onPress={() => router.push('/(drawer)/subscription')} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Get Detailed Report</Text>
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
        action={<Text style={styles.progress}>{Math.round(((current + 1) / questions.length) * 100)}%</Text>}
      />

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{questions[current].q}</Text>
      </View>

      <View style={styles.options}>
        {questions[current].options.map((option) => {
          const active = answers[current] === option;
          return (
            <Pressable key={option} onPress={() => select(option)} style={[styles.option, active && styles.optionActive]}>
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Pressable disabled={current === 0} onPress={() => setCurrent((value) => value - 1)} style={[styles.navButton, current === 0 && styles.navButtonDisabled]}>
          <Text style={[styles.navButtonText, current === 0 && styles.navButtonTextDisabled]}>Previous</Text>
        </Pressable>
        {current < questions.length - 1 ? (
          <Pressable
            disabled={!answers[current]}
            onPress={() => setCurrent((value) => value + 1)}
            style={[styles.navButton, styles.primaryButton, !answers[current] && styles.navButtonDisabled]}
          >
            <Text style={styles.primaryButtonText}>Next</Text>
          </Pressable>
        ) : (
          <Pressable
            disabled={!answers[current]}
            onPress={() => setCompleted(true)}
            style={[styles.navButton, styles.primaryButton, !answers[current] && styles.navButtonDisabled]}
          >
            <Text style={styles.primaryButtonText}>Finish Test</Text>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.primary,
  },
  questionCard: {
    backgroundColor: palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
  },
  questionText: {
    fontSize: 19,
    lineHeight: 28,
    fontWeight: '800',
    color: palette.text,
  },
  options: {
    gap: 12,
  },
  option: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  optionActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
  },
  optionTextActive: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.45,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.text,
  },
  navButtonTextDisabled: {
    color: palette.muted,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  resultCard: {
    backgroundColor: palette.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 22,
    gap: 12,
    alignItems: 'center',
  },
  resultScore: {
    fontSize: 42,
    fontWeight: '900',
    color: palette.primary,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.text,
    textAlign: 'center',
  },
  resultCopy: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.muted,
    textAlign: 'center',
  },
});

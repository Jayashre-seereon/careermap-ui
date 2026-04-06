import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import { palette } from '../../src/careermap-data';
import { Screen, SectionHeader } from '../../src/careermap-ui';

const quizzes = [
  { title: 'Engineering Career Quiz', description: 'Test your engineering knowledge', questions: 5 },
  { title: 'Medical Career Quiz', description: 'Explore medical career paths', questions: 5 },
  { title: 'Business Aptitude Quiz', description: 'Assess your business acumen', questions: 5 },
];

const sampleQuestion = {
  q: 'Which programming language is most used in AI?',
  options: ['Python', 'Java', 'C++', 'Ruby'],
  correct: 0,
};

export default function QuizScreen() {
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  if (completed) {
    return (
      <Screen>
        <SectionHeader title="Quiz Complete" subtitle="A lightweight quiz flow adapted from the web prototype." />
        <View style={styles.resultCard}>
          <Text style={styles.resultScore}>{answer === sampleQuestion.correct ? '5/5' : '3/5'}</Text>
          <Text style={styles.resultTitle}>Good effort. Keep learning and try another quiz.</Text>
        </View>
      </Screen>
    );
  }

  if (activeQuiz !== null) {
    return (
      <Screen>
        <SectionHeader title={quizzes[activeQuiz].title} subtitle="Question 1 of 5" />
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{sampleQuestion.q}</Text>
        </View>
        <View style={styles.options}>
          {sampleQuestion.options.map((option, index) => (
            <Pressable key={option} onPress={() => setAnswer(index)} style={[styles.option, answer === index && styles.optionActive]}>
              <Text style={[styles.optionText, answer === index && styles.optionTextActive]}>{option}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable disabled={answer === null} onPress={() => setCompleted(true)} style={[styles.submitButton, answer === null && styles.submitButtonDisabled]}>
          <Text style={styles.submitButtonText}>Finish Quiz</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="Quizzes" subtitle="Quick category quizzes from the same prototype family." />
      <View style={styles.list}>
        {quizzes.map((quiz, index) => (
          <Pressable key={quiz.title} onPress={() => setActiveQuiz(index)} style={styles.quizCard}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <Text style={styles.quizDescription}>{quiz.description}</Text>
            <Text style={styles.quizMeta}>{quiz.questions} questions</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  quizCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 6,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.text,
  },
  quizDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
  quizMeta: {
    fontSize: 12,
    color: palette.primary,
    fontWeight: '800',
  },
  questionCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '800',
    color: palette.text,
  },
  options: {
    gap: 12,
  },
  option: {
    backgroundColor: palette.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 15,
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
  submitButton: {
    borderRadius: 16,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  resultCard: {
    backgroundColor: palette.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 22,
    gap: 12,
    alignItems: 'center',
  },
  resultScore: {
    fontSize: 40,
    fontWeight: '900',
    color: palette.primary,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: palette.text,
    textAlign: 'center',
  },
});

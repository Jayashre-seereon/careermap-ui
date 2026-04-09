import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import { palette } from '../../src/careermap-data';
import { Screen, SectionHeader } from '../../src/careermap-ui';

const quizzes = [
  { title: 'Engineering Career Quiz', description: 'Test your engineering knowledge', questions: 5, emoji: 'ENG' },
  { title: 'Medical Career Quiz', description: 'Explore medical career paths', questions: 5, emoji: 'MED' },
  { title: 'Business Aptitude Quiz', description: 'Assess your business acumen', questions: 5, emoji: 'BIZ' },
  { title: 'Technology Trends Quiz', description: 'Stay updated with tech trends', questions: 5, emoji: 'TECH' },
];

const sampleQuestions = [
  { q: 'Which programming language is most used in AI?', options: ['Python', 'Java', 'C++', 'Ruby'], correct: 0 },
  { q: 'What does CPU stand for?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit'], correct: 1 },
  { q: 'HTML is a programming language.', options: ['True', 'False', 'Sometimes', 'Depends'], correct: 1 },
  { q: 'Which company created React?', options: ['Google', 'Microsoft', 'Meta', 'Amazon'], correct: 2 },
  { q: 'RAM stands for?', options: ['Random Access Memory', 'Read Access Memory', 'Run Access Memory', 'Random Assign Memory'], correct: 0 },
];

export default function QuizScreen() {
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(sampleQuestions.length).fill(null));
  const [completed, setCompleted] = useState(false);
  const score = answers.filter((answer, index) => answer === sampleQuestions[index].correct).length;

  if (completed) {
    return (
      <Screen>
        <SectionHeader
          title="Quiz Complete"
          subtitle="Completion state and scoring now follow the prototype more closely."
          action={
            <Pressable
              onPress={() => {
                setActiveQuiz(null);
                setCurrentQuestion(0);
                setAnswers(Array(sampleQuestions.length).fill(null));
                setCompleted(false);
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />
        <View style={styles.resultCard}>
          <Text style={styles.resultScore}>{score}/5</Text>
          <Text style={styles.resultTitle}>
            {score >= 4 ? 'Excellent work. You are doing great.' : score >= 2 ? 'Good effort. Keep learning.' : 'Keep practicing. You will improve.'}
          </Text>
          <Pressable
            onPress={() => {
              setActiveQuiz(null);
              setCurrentQuestion(0);
              setAnswers(Array(sampleQuestions.length).fill(null));
              setCompleted(false);
            }}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Try Another Quiz</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (activeQuiz !== null) {
    const current = sampleQuestions[currentQuestion];

    return (
      <Screen>
        <SectionHeader title={quizzes[activeQuiz].title} subtitle={`Question ${currentQuestion + 1} of ${sampleQuestions.length}`} />
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }]} />
        </View>
        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>Question {currentQuestion + 1}</Text>
          <Text style={styles.questionText}>{current.q}</Text>
        </View>
        <View style={styles.options}>
          {current.options.map((option, index) => (
            <Pressable
              key={option}
              onPress={() => {
                const nextAnswers = [...answers];
                nextAnswers[currentQuestion] = index;
                setAnswers(nextAnswers);
              }}
              style={[styles.option, answers[currentQuestion] === index && styles.optionActive]}
            >
              <Text style={[styles.optionText, answers[currentQuestion] === index && styles.optionTextActive]}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          disabled={answers[currentQuestion] === null}
          onPress={() => {
            if (currentQuestion === sampleQuestions.length - 1) {
              setCompleted(true);
            } else {
              setCurrentQuestion((value) => value + 1);
            }
          }}
          style={[styles.submitButton, answers[currentQuestion] === null && styles.submitButtonDisabled]}
        >
          <Text style={styles.submitButtonText}>{currentQuestion === sampleQuestions.length - 1 ? 'Finish Quiz' : 'Next'}</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="Quizzes" subtitle="Quick category quizzes from the same prototype family." />
      <View style={styles.list}>
        {quizzes.map((quiz, index) => (
          <Pressable
            key={quiz.title}
            onPress={() => {
              setActiveQuiz(index);
              setCurrentQuestion(0);
              setAnswers(Array(sampleQuestions.length).fill(null));
            }}
            style={styles.quizCard}
          >
            <View style={styles.quizEmojiWrap}>
              <Text style={styles.quizEmoji}>{quiz.emoji}</Text>
            </View>
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
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f2ebe6',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  quizEmojiWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: `${palette.blue}12`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  quizEmoji: {
    fontSize: 12,
    fontWeight: '900',
    color: palette.blue,
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
    gap: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#eadfd6',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.green,
  },
  questionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: palette.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
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

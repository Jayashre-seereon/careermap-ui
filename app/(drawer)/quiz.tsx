import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';

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
              className="h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-[#f2ebe6]"
            >
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />
        <View className="items-center gap-3 rounded-[26px] border border-line bg-card p-[22px]">
          <Text className="text-[40px] font-black text-brand">{score}/5</Text>
          <Text className="text-center text-[17px] font-extrabold text-ink">
            {score >= 4 ? 'Excellent work. You are doing great.' : score >= 2 ? 'Good effort. Keep learning.' : 'Keep practicing. You will improve.'}
          </Text>
          <Pressable
            onPress={() => {
              setActiveQuiz(null);
              setCurrentQuestion(0);
              setAnswers(Array(sampleQuestions.length).fill(null));
              setCompleted(false);
            }}
            className="w-full rounded-[16px] bg-brand py-[14px]"
          >
            <Text className="text-center text-[14px] font-extrabold text-white">Try Another Quiz</Text>
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
        <View className="h-2 overflow-hidden rounded-full bg-line">
          <View className="h-full rounded-full bg-success" style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }} />
        </View>
        <View className="gap-2 rounded-[22px] border border-line bg-card p-5">
          <Text className="text-[10px] font-extrabold uppercase tracking-[1px] text-muted">Question {currentQuestion + 1}</Text>
          <Text className="text-[18px] font-extrabold leading-[26px] text-ink">{current.q}</Text>
        </View>
        <View className="gap-3">
          {current.options.map((option, index) => (
            <Pressable
              key={option}
              onPress={() => {
                const nextAnswers = [...answers];
                nextAnswers[currentQuestion] = index;
                setAnswers(nextAnswers);
              }}
              className={`rounded-[18px] border p-[15px] ${answers[currentQuestion] === index ? 'border-brand bg-brand' : 'border-line bg-card'}`}
            >
              <Text className={`text-[14px] font-bold ${answers[currentQuestion] === index ? 'text-white' : 'text-ink'}`}>
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
          className="rounded-[16px] bg-brand py-[14px]"
          style={({ pressed }) => ({ opacity: answers[currentQuestion] === null || pressed ? 0.45 : 1 })}
        >
          <Text className="text-center text-[14px] font-extrabold text-white">{currentQuestion === sampleQuestions.length - 1 ? 'Finish Quiz' : 'Next'}</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="Quizzes" subtitle="Quick category quizzes from the same prototype family." />
      <View className="gap-3">
        {quizzes.map((quiz, index) => (
          <Pressable
            key={quiz.title}
            onPress={() => {
              setActiveQuiz(index);
              setCurrentQuestion(0);
              setAnswers(Array(sampleQuestions.length).fill(null));
            }}
            className="gap-1.5 rounded-[22px] border border-line bg-card p-[18px]"
          >
            <View className="mb-1 h-[50px] w-[50px] items-center justify-center rounded-[16px]" style={{ backgroundColor: `${palette.blue}12` }}>
              <Text className="text-[12px] font-black" style={{ color: palette.blue }}>{quiz.emoji}</Text>
            </View>
            <Text className="text-[16px] font-extrabold text-ink">{quiz.title}</Text>
            <Text className="text-[13px] leading-5 text-muted">{quiz.description}</Text>
            <Text className="text-[12px] font-extrabold text-brand">{quiz.questions} questions</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

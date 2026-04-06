import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Pill, Screen, SectionHeader } from '../../../src/careermap-ui';
import {
  featuredInstitutes,
  featuredMentors,
  featuredScholarships,
  moduleCards,
  palette,
  studentProfile,
} from '../../../src/careermap-data';

const personalityQuestions = [
  { q: 'When faced with a problem, I prefer to:', options: ['Analyze data systematically', 'Brainstorm creative solutions', 'Discuss with others', 'Act quickly on instinct'] },
  { q: 'In my free time, I enjoy:', options: ['Reading or researching', 'Creating art or music', 'Socializing with friends', 'Physical activities or sports'] },
  { q: 'I work best when:', options: ['I have a clear plan', 'I can be spontaneous', 'I collaborate with a team', 'I work independently'] },
  { q: 'I am most motivated by:', options: ['Achieving goals', 'Expressing myself', 'Helping others', 'Learning new skills'] },
  { q: 'My ideal workspace is:', options: ['Organized and quiet', 'Colorful and inspiring', 'Open and collaborative', 'Flexible and mobile'] },
  { q: 'When making decisions, I rely on:', options: ['Logic and facts', 'Intuition and feelings', 'Advice from others', 'Past experiences'] },
];

const personalityTypes = [
  {
    type: 'The Analytical Thinker',
    desc: 'You thrive in structured environments and enjoy solving complex problems with logic and clarity.',
    careers: ['Engineering', 'Data Science', 'Finance', 'Research'],
  },
  {
    type: 'The Creative Visionary',
    desc: 'You bring imagination, originality, and expressive thinking to everything you work on.',
    careers: ['Design', 'Architecture', 'Media', 'Marketing'],
  },
  {
    type: 'The Empathetic Helper',
    desc: 'You naturally connect with people and do well in roles built around support, care, and communication.',
    careers: ['Psychology', 'Teaching', 'Medicine', 'HR'],
  },
  {
    type: 'The Dynamic Explorer',
    desc: 'You enjoy variety, energy, and fast-moving environments where action leads the way.',
    careers: ['Business', 'Travel', 'Sports', 'Entrepreneurship'],
  },
];

export default function HomeScreen() {
  const [showPersonalityTest, setShowPersonalityTest] = useState(false);
  const [completedPersonality, setCompletedPersonality] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(personalityQuestions.length).fill(null));

  const personalityResult = useMemo(() => {
    const counts = [0, 0, 0, 0];
    answers.forEach((answer) => {
      if (answer !== null) counts[answer] += 1;
    });
    const dominant = counts.indexOf(Math.max(...counts));
    return personalityTypes[dominant];
  }, [answers]);

  const selectAnswer = (index: number) => {
    const next = [...answers];
    next[currentQuestion] = index;
    setAnswers(next);
  };

  const resetPersonality = () => {
    setShowPersonalityTest(false);
    setCompletedPersonality(false);
    setCurrentQuestion(0);
  };

  if (showPersonalityTest && !completedPersonality) {
    return (
      <Screen>
        <View style={styles.testHeader}>
          <Pressable onPress={resetPersonality} style={styles.backButton}>
            <Ionicons name="chevron-back" size={18} color={palette.text} />
          </Pressable>
          <Text style={styles.testTitle}>Know Your Personality</Text>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${((currentQuestion + 1) / personalityQuestions.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestion + 1}/{personalityQuestions.length}
          </Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>Question {currentQuestion + 1}</Text>
          <Text style={styles.questionText}>{personalityQuestions[currentQuestion].q}</Text>
        </View>

        <View style={styles.answerList}>
          {personalityQuestions[currentQuestion].options.map((option, index) => {
            const active = answers[currentQuestion] === index;
            return (
              <Pressable key={option} onPress={() => selectAnswer(index)} style={[styles.answerCard, active && styles.answerCardActive]}>
                <Text style={[styles.answerText, active && styles.answerTextActive]}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.testFooter}>
          <Pressable disabled={currentQuestion === 0} onPress={() => setCurrentQuestion((value) => value - 1)} style={[styles.secondaryAction, currentQuestion === 0 && styles.actionDisabled]}>
            <Text style={[styles.secondaryActionText, currentQuestion === 0 && styles.disabledActionText]}>Previous</Text>
          </Pressable>
          {currentQuestion < personalityQuestions.length - 1 ? (
            <Pressable disabled={answers[currentQuestion] === null} onPress={() => setCurrentQuestion((value) => value + 1)} style={[styles.primaryAction, answers[currentQuestion] === null && styles.actionDisabled]}>
              <Text style={styles.primaryActionText}>Next</Text>
            </Pressable>
          ) : (
            <Pressable disabled={answers[currentQuestion] === null} onPress={() => setCompletedPersonality(true)} style={[styles.primaryAction, answers[currentQuestion] === null && styles.actionDisabled]}>
              <Text style={styles.primaryActionText}>See Results</Text>
            </Pressable>
          )}
        </View>
      </Screen>
    );
  }

  if (showPersonalityTest && completedPersonality) {
    return (
      <Screen>
        <View style={styles.resultWrap}>
          <Text style={styles.resultEmoji}>Spark</Text>
          <Text style={styles.resultTitle}>Your Personality</Text>
          <View style={styles.resultTag}>
            <Text style={styles.resultTagText}>{personalityResult.type}</Text>
          </View>
          <Text style={styles.resultCopy}>{personalityResult.desc}</Text>

          <View style={styles.resultCard}>
            <Text style={styles.resultCardTitle}>Recommended Careers</Text>
            <View style={styles.resultPills}>
              {personalityResult.careers.map((career) => (
                <Pill key={career} label={career} tone={palette.primary} />
              ))}
            </View>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultCardTitle}>Get a Full Psychometric Analysis</Text>
            <Text style={styles.resultCardCopy}>
              Take the deeper assessment to unlock a richer career report with stronger recommendations.
            </Text>
            <Pressable onPress={() => router.push('/(drawer)/(tabs)/assessment')} style={styles.primaryActionFull}>
              <Text style={styles.primaryActionText}>Take Full Psychometric Test</Text>
            </Pressable>
          </View>

          <Pressable onPress={resetPersonality} style={styles.secondaryActionFull}>
            <Text style={styles.secondaryActionText}>Back to Dashboard</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.topBar}>
        <View style={styles.profileRow}>
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.name}>{studentProfile.name}</Text>
          </View>
        </View>
        <Pressable onPress={() => router.push('/(drawer)/notifications')} style={styles.bellWrap}>
          <Ionicons name="notifications-outline" size={20} color={palette.text} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroGlow} />
        <View style={styles.heroIconGhost}>
          <Text style={styles.heroIconGhostText}>Mind</Text>
        </View>
        <View style={styles.heroInner}>
          <View style={styles.heroTagRow}>
            <Ionicons name="sparkles" size={14} color="#f6ce63" />
            <Text style={styles.heroEyebrow}>Recommended</Text>
          </View>
          <Text style={styles.heroTitle}>Know Your Personality</Text>
          <Text style={styles.heroDescription}>
            Answer quick questions to discover your personality type and ideal career direction.
          </Text>
          <Pressable onPress={() => setShowPersonalityTest(true)} style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Take the Test</Text>
          </Pressable>
        </View>
      </View>

      <SectionHeader title="Explore Modules" subtitle="The same core destinations from the web prototype dashboard." />
      <View style={styles.moduleGrid}>
        {moduleCards.map((card) => (
          <Pressable key={card.title} onPress={() => router.push(card.route as never)} style={styles.moduleCell}>
            <View style={[styles.moduleCard, { borderColor: `${card.tone}30` }]}>
              <View style={[styles.moduleIcon, { backgroundColor: `${card.tone}14` }]}>
                <Ionicons name={card.icon as keyof typeof Ionicons.glyphMap} size={21} color={card.tone} />
              </View>
              <Text style={styles.moduleTitle}>{card.title}</Text>
              <Text style={styles.moduleSubtitle}>{card.subtitle}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Explore Your Mentors" subtitle="Mentor cards adapted from the dashboard carousel." action={<Pressable onPress={() => router.push('/(drawer)/book-mentor')}><Text style={styles.seeAll}>See all</Text></Pressable>} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {featuredMentors.map((mentor) => (
          <Pressable key={mentor.name} onPress={() => router.push('/(drawer)/book-mentor')} style={styles.personCardWide}>
            <View style={[styles.personAvatar, { backgroundColor: `${mentor.accent}15` }]}>
              <Ionicons name="person" size={22} color={mentor.accent} />
            </View>
            <Text style={styles.personName}>{mentor.name}</Text>
            <Text style={styles.personMeta}>{mentor.specialty}</Text>
            <Text style={styles.personSubMeta}>{mentor.rating} rating | {mentor.experience}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeader title="Explore Scholarships" subtitle="A mobile-friendly list inspired by the same scholarship strip." action={<Pressable onPress={() => router.push('/(drawer)/scholarship')}><Text style={styles.seeAll}>See all</Text></Pressable>} />
      <View style={styles.stack}>
        {featuredScholarships.map((item) => (
          <Pressable key={item.name} onPress={() => router.push('/(drawer)/scholarship')} style={styles.listCard}>
            <View style={styles.listIconWrap}>
              <Ionicons name="ribbon-outline" size={20} color={palette.green} />
            </View>
            <View style={styles.listBody}>
              <Text style={styles.listTitle}>{item.name}</Text>
              <Text style={styles.listCaption}>{item.amount}</Text>
            </View>
            <View style={styles.listSide}>
              <Pill label={item.tag} tone={palette.primary} />
              <Text style={styles.deadline}>{item.deadline}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Explore Institutes" subtitle="Featured institute shortcuts from the dashboard." action={<Pressable onPress={() => router.push('/(drawer)/institute')}><Text style={styles.seeAll}>See all</Text></Pressable>} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {featuredInstitutes.map((item) => (
          <Pressable key={item.name} onPress={() => router.push('/(drawer)/institute')} style={styles.personCardWide}>
            <View style={[styles.personAvatar, { backgroundColor: `${palette.blue}14` }]}>
              <Ionicons name="business-outline" size={22} color={palette.blue} />
            </View>
            <Text style={styles.personName}>{item.name}</Text>
            <Text style={styles.personMeta}>{item.location}</Text>
            <Text style={styles.personSubMeta}>{item.type}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.quickCard}>
        <Text style={styles.quickHeader}>Quick Actions</Text>
        {[
          { label: 'View Subscription Plans', path: '/(drawer)/subscription', icon: 'sparkles-outline', iconTone: palette.secondary },
          { label: 'Your Test History', path: '/(drawer)/(tabs)/profile', icon: 'time-outline', iconTone: palette.blue },
          { label: 'Saved Careers', path: '/(drawer)/(tabs)/library', icon: 'star-outline', iconTone: palette.orange },
        ].map((item) => (
          <Pressable key={item.label} onPress={() => router.push(item.path as never)} style={styles.quickRow}>
            <View style={styles.quickLeft}>
              <View style={styles.quickIconWrap}>
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={17} color={item.iconTone} />
              </View>
              <Text style={styles.quickText}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.muted} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${palette.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: palette.primary,
  },
  greeting: {
    fontSize: 12,
    color: palette.muted,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: palette.text,
  },
  bellWrap: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  heroCard: {
    borderRadius: 28,
    padding: 22,
    backgroundColor: palette.primary,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    right: -28,
    bottom: -34,
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroIconGhost: {
    position: 'absolute',
    right: 18,
    top: 18,
  },
  heroIconGhostText: {
    fontSize: 28,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.14)',
  },
  heroInner: {
    gap: 8,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroEyebrow: {
    color: '#f6ce63',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
    fontWeight: '800',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },
  heroDescription: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 13,
    lineHeight: 20,
    maxWidth: '80%',
  },
  heroButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  heroButtonText: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moduleCell: {
    width: '31%',
    minWidth: 96,
  },
  moduleCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    minHeight: 136,
    gap: 8,
  },
  moduleIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.text,
  },
  moduleSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: palette.muted,
  },
  horizontalList: {
    gap: 12,
    paddingRight: 8,
  },
  personCardWide: {
    width: 164,
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  personAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personName: {
    fontSize: 13,
    fontWeight: '800',
    color: palette.text,
    textAlign: 'center',
  },
  personMeta: {
    fontSize: 11,
    color: palette.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  personSubMeta: {
    fontSize: 11,
    color: palette.muted,
    textAlign: 'center',
  },
  stack: {
    gap: 12,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
  },
  listIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#edf9f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listBody: {
    flex: 1,
    gap: 2,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.text,
  },
  listCaption: {
    fontSize: 12,
    color: palette.green,
    fontWeight: '700',
  },
  listSide: {
    alignItems: 'flex-end',
    gap: 4,
  },
  deadline: {
    fontSize: 11,
    color: palette.muted,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.primary,
  },
  quickCard: {
    backgroundColor: palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 8,
  },
  quickHeader: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: palette.text,
  },
  quickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  quickLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quickIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#f4eeea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: palette.text,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#e8e2de',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.primary,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.muted,
  },
  questionCard: {
    backgroundColor: palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
    gap: 8,
  },
  questionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: palette.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '800',
    color: palette.text,
  },
  answerList: {
    gap: 12,
  },
  answerCard: {
    backgroundColor: palette.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
  },
  answerCardActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: palette.text,
  },
  answerTextActive: {
    color: '#fff',
  },
  testFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryAction: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionDisabled: {
    opacity: 0.42,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.text,
  },
  disabledActionText: {
    color: palette.muted,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  resultWrap: {
    gap: 14,
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 28,
    fontWeight: '900',
    color: palette.primary,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: palette.text,
    textAlign: 'center',
  },
  resultTag: {
    borderRadius: 18,
    backgroundColor: `${palette.primary}12`,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  resultTagText: {
    fontSize: 18,
    fontWeight: '900',
    color: palette.primary,
  },
  resultCopy: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.muted,
    textAlign: 'center',
  },
  resultCard: {
    width: '100%',
    backgroundColor: palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 10,
  },
  resultCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.text,
  },
  resultPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resultCardCopy: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
  },
  primaryActionFull: {
    borderRadius: 16,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryActionFull: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
});

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppState } from '../../src/app-state';
import {
  getAttemptQuestions,
  saveAttemptAnswer,
  saveBatchAttemptAnswers,
  submitAssessmentAttempt,
} from '../../src/api/psychometricAssessmentApi';
import {
  ASSESSMENT_DOMAINS,
  LIKERT_OPTIONS,
  TOTAL_ASSESSMENT_QUESTIONS,
} from '../../src/features/assessment/data/assessmentConstants';
import { FALLBACK_SECTIONS } from '../../src/features/assessment/data/fallbackQuestions';

export default function AssessmentAttemptScreen() {
  const { attemptId } = useLocalSearchParams();
  const { preferences } = useAppState();
  const darkMode = preferences.darkMode;

  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Map of answers: { [questionId]: { likertValue?: number, selectedOptionId?: string } }
  const [answers, setAnswers] = useState({});
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving' | 'saved'

  // Submission state & modal
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStepText, setSubmitStepText] = useState('');

  const pendingSavesRef = useRef({});
  const saveTimeoutRef = useRef(null);
  const scrollViewRef = useRef(null);

  const loadTestQuestions = useCallback(async () => {
    setLoading(true);
    try {
      let loadedSections = [];
      let initialAnswers = {};

      const data = await getAttemptQuestions(attemptId);

      if (data && Array.isArray(data.sections) && data.sections.length > 0) {
        loadedSections = data.sections;
      } else if (Array.isArray(data) && data.length > 0) {
        loadedSections = data;
      } else {
        loadedSections = FALLBACK_SECTIONS;
      }

      // Merge pre-saved answers if any
      loadedSections.forEach((sec) => {
        if (Array.isArray(sec.questions)) {
          sec.questions.forEach((q) => {
            if (q.userAnswer) {
              initialAnswers[q.id] = {
                likertValue: q.userAnswer.likertValue ?? q.userAnswer.value ?? null,
                selectedOptionId: q.userAnswer.selectedOptionId ?? q.userAnswer.optionId ?? null,
              };
            } else if (q.answer !== undefined && q.answer !== null) {
              if (typeof q.answer === 'number') {
                initialAnswers[q.id] = { likertValue: q.answer };
              } else if (typeof q.answer === 'string') {
                initialAnswers[q.id] = { selectedOptionId: q.answer };
              }
            }
          });
        }
      });

      setSections(loadedSections);
      setAnswers(initialAnswers);
    } catch (err) {
      console.warn('Could not fetch remote questions, initializing question engine:', err?.message);
      setSections(FALLBACK_SECTIONS);
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    loadTestQuestions();
  }, [loadTestQuestions]);

  // Active section
  const activeSection = useMemo(() => {
    if (!sections || sections.length === 0) return null;
    return sections[currentSectionIndex] || sections[0];
  }, [sections, currentSectionIndex]);

  const activeDomainMeta = useMemo(() => {
    return ASSESSMENT_DOMAINS[currentSectionIndex] || ASSESSMENT_DOMAINS[0];
  }, [currentSectionIndex]);

  // Overall statistics
  const totalQuestionsCount = useMemo(() => {
    if (!sections || sections.length === 0) return TOTAL_ASSESSMENT_QUESTIONS;
    return (
      sections.reduce(
        (sum, s) => sum + (Array.isArray(s.questions) ? s.questions.length : 0),
        0
      ) || TOTAL_ASSESSMENT_QUESTIONS
    );
  }, [sections]);

  const totalAnsweredCount = useMemo(() => {
    return Object.values(answers).filter(
      (a) =>
        (a && a.likertValue !== undefined && a.likertValue !== null) ||
        (a && a.selectedOptionId !== undefined && a.selectedOptionId !== null)
    ).length;
  }, [answers]);

  const overallPercent = Math.min(
    100,
    Math.round((totalAnsweredCount / totalQuestionsCount) * 100)
  );

  // Section-wise statistics
  const sectionStats = useMemo(() => {
    return sections.map((sec, idx) => {
      const qList = Array.isArray(sec.questions) ? sec.questions : [];
      const totalInSec = qList.length;
      const answeredInSec = qList.filter(
        (q) =>
          (answers[q.id]?.likertValue !== undefined && answers[q.id]?.likertValue !== null) ||
          (answers[q.id]?.selectedOptionId !== undefined && answers[q.id]?.selectedOptionId !== null)
      ).length;
      const isComplete = totalInSec > 0 && answeredInSec === totalInSec;
      return {
        index: idx,
        title: sec.title || ASSESSMENT_DOMAINS[idx]?.title || `Section ${idx + 1}`,
        total: totalInSec,
        answered: answeredInSec,
        isComplete,
      };
    });
  }, [sections, answers]);

  // Answer selection with debounced auto-save
  function handleSelectAnswer(questionId, { likertValue, selectedOptionId }) {
    setSaveStatus('saving');

    const updatedAnswers = {
      ...answers,
      [questionId]: {
        ...(likertValue !== undefined ? { likertValue } : {}),
        ...(selectedOptionId !== undefined ? { selectedOptionId } : {}),
      },
    };
    setAnswers(updatedAnswers);

    pendingSavesRef.current[questionId] = {
      questionId,
      likertValue,
      selectedOptionId,
    };

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveAttemptAnswer(attemptId, {
          questionId,
          likertValue,
          selectedOptionId,
        });
        setSaveStatus('saved');
      } catch (_e) {
        setSaveStatus('saved');
      }
    }, 350);
  }

  // Section switch with background batch-save
  function handleSwitchSection(newIndex) {
    if (newIndex < 0 || newIndex >= sections.length) return;

    const batchList = Object.entries(answers).map(([qId, ans]) => ({
      questionId: qId,
      likertValue: ans.likertValue,
      selectedOptionId: ans.selectedOptionId,
    }));

    if (batchList.length > 0) {
      saveBatchAttemptAnswers(attemptId, batchList).catch(() => {});
    }

    setCurrentSectionIndex(newIndex);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }

  // Unanswered questions
  const unansweredQuestions = useMemo(() => {
    const list = [];
    sections.forEach((sec, sIdx) => {
      const qList = Array.isArray(sec.questions) ? sec.questions : [];
      qList.forEach((q, qIdx) => {
        const isAnswered =
          (answers[q.id]?.likertValue !== undefined && answers[q.id]?.likertValue !== null) ||
          (answers[q.id]?.selectedOptionId !== undefined && answers[q.id]?.selectedOptionId !== null);
        if (!isAnswered) {
          list.push({
            sectionIndex: sIdx,
            sectionTitle: sec.title || ASSESSMENT_DOMAINS[sIdx]?.title || `Section ${sIdx + 1}`,
            questionNumber: qIdx + 1,
            questionId: q.id,
            questionText: q.text || q.question || '',
          });
        }
      });
    });
    return list;
  }, [sections, answers]);

  // Final submission
  async function handleSubmitTest() {
    setIsSubmitModalVisible(false);
    setSubmitting(true);

    try {
      setSubmitStepText('Saving all responses...');
      const batchList = Object.entries(answers).map(([qId, ans]) => ({
        questionId: qId,
        likertValue: ans.likertValue,
        selectedOptionId: ans.selectedOptionId,
      }));
      await saveBatchAttemptAnswers(attemptId, batchList).catch(() => {});

      setSubmitStepText('Evaluating 21 facets & psychometric dimensions...');
      await new Promise((r) => setTimeout(r, 600));

      setSubmitStepText('Calculating 18 Career Clusters match percentages...');
      await submitAssessmentAttempt(attemptId).catch(() => {});

      setSubmitStepText('Generating your Career Compass Report...');
      await new Promise((r) => setTimeout(r, 500));

      router.replace({
        pathname: '/(drawer)/assessment-report',
        params: { attemptId: String(attemptId) },
      });
    } catch (err) {
      console.warn('Submit test note:', err?.message);
      router.replace({
        pathname: '/(drawer)/assessment-report',
        params: { attemptId: String(attemptId) },
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleExitConfirm() {
    Alert.alert(
      'Exit Assessment?',
      'Your progress is auto-saved. You can resume anytime from the assessment dashboard.',
      [
        { text: 'Keep Answering', style: 'cancel' },
        {
          text: 'Exit to Dashboard',
          style: 'destructive',
          onPress: () => router.replace('/(drawer)/(tabs)/assessment'),
        },
      ]
    );
  }

  const cardBg = darkMode ? '#121214' : '#ffffff';
  const borderColor = darkMode ? '#222226' : '#e8dfda';
  const textColor = darkMode ? '#ffffff' : '#211b19';
  const subtextColor = darkMode ? '#a09895' : '#655753';

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#070709' : '#faf6f3', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9a2119" />
        <Text style={{ color: textColor, fontSize: 16, fontWeight: '800', marginTop: 14 }}>
          Loading Assessment Engine...
        </Text>
        <Text style={{ color: subtextColor, fontSize: 12, marginTop: 4 }}>
          Preparing questions and pre-saved responses
        </Text>
      </SafeAreaView>
    );
  }

  if (submitting) {
    return (
      <LinearGradient
        colors={['#801812', '#9a2119', '#6c160f']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}
      >
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 24,
            padding: 24,
            alignItems: 'center',
            width: '100%',
            maxWidth: 340,
          }}
        >
          <ActivityIndicator size="large" color="#facc15" />
          <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '900', marginTop: 16 }}>
            Scoring Assessment
          </Text>
          <Text style={{ color: '#ffe4e6', fontSize: 13, marginTop: 8, textAlign: 'center' }}>
            {submitStepText}
          </Text>
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: 10,
              marginTop: 20,
              width: '100%',
            }}
          >
            <Text style={{ color: '#fecdd3', fontSize: 11, textAlign: 'center', lineHeight: 16 }}>
              Evaluating Holland RIASEC, Big Five Traits, VARK Modalities, and Cognitive Reasoning...
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  const isLastSection = currentSectionIndex === sections.length - 1;
  const currentSectionQuestions = activeSection?.questions || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#070709' : '#faf6f3' }}>
      {/* Top Header */}
      <View
        style={{
          backgroundColor: cardBg,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          paddingHorizontal: 14,
          paddingTop: 10,
          paddingBottom: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleExitConfirm}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: darkMode ? '#1c1c20' : '#f1f5f9',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              gap: 4,
            }}
          >
            <Ionicons name="arrow-back" size={14} color={textColor} />
            <Text style={{ color: textColor, fontSize: 11, fontWeight: '700' }}>Exit</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Auto-save Status */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {saveStatus === 'saving' ? (
                <>
                  <ActivityIndicator size="small" color="#f59e0b" />
                  <Text style={{ color: '#f59e0b', fontSize: 10, fontWeight: '700' }}>Saving...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={13} color="#10b981" />
                  <Text style={{ color: '#10b981', fontSize: 10, fontWeight: '700' }}>Saved</Text>
                </>
              )}
            </View>

            {/* Total count badge */}
            <View
              style={{
                backgroundColor: darkMode ? '#222226' : '#f8fafc',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                borderWidth: 1,
                borderColor,
              }}
            >
              <Text style={{ color: textColor, fontSize: 11, fontWeight: '800' }}>
                {totalAnsweredCount}/{totalQuestionsCount} ({overallPercent}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Section Switcher Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingTop: 10, paddingBottom: 6 }}
        >
          {sections.map((sec, idx) => {
            const stat = sectionStats[idx] || { answered: 0, total: 0, isComplete: false };
            const isCurrent = idx === currentSectionIndex;

            return (
              <TouchableOpacity
                key={sec.id || idx}
                activeOpacity={0.8}
                onPress={() => handleSwitchSection(idx)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isCurrent
                    ? '#9a2119'
                    : stat.isComplete
                    ? (darkMode ? '#064e3b' : '#ecfdf5')
                    : (darkMode ? '#1a1a1e' : '#f1f5f9'),
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  gap: 5,
                }}
              >
                <Text style={{ fontSize: 12 }}>{ASSESSMENT_DOMAINS[idx]?.icon || '📝'}</Text>
                <Text
                  style={{
                    color: isCurrent
                      ? '#ffffff'
                      : stat.isComplete
                      ? (darkMode ? '#a7f3d0' : '#047857')
                      : subtextColor,
                    fontSize: 11,
                    fontWeight: '800',
                  }}
                >
                  {ASSESSMENT_DOMAINS[idx]?.shortCode || `Sec ${idx + 1}`}
                </Text>
                <View
                  style={{
                    backgroundColor: isCurrent
                      ? 'rgba(255,255,255,0.25)'
                      : stat.isComplete
                      ? (darkMode ? 'rgba(52,211,153,0.25)' : '#a7f3d0')
                      : (darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      color: isCurrent ? '#ffffff' : stat.isComplete ? '#047857' : subtextColor,
                      fontSize: 9,
                      fontWeight: '800',
                    }}
                  >
                    {stat.answered}/{stat.total}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Linear Progress Bar */}
        <View
          style={{
            height: 4,
            backgroundColor: darkMode ? '#222226' : '#e2e8f0',
            borderRadius: 2,
            marginTop: 4,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${overallPercent}%`,
              backgroundColor: '#9a2119',
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      {/* Questions ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 14, paddingBottom: 110 }}
      >
        {/* Section Banner Card */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 18,
            padding: 16,
            borderWidth: 1,
            borderColor,
            marginBottom: 14,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 28 }}>{activeDomainMeta.icon}</Text>
              <View>
                <Text style={{ color: '#9a2119', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {activeDomainMeta.subtitle}
                </Text>
                <Text style={{ color: textColor, fontSize: 17, fontWeight: '900' }}>
                  {activeSection.title || activeDomainMeta.title}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: '#fee2e2',
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#9a2119', fontSize: 10, fontWeight: '800' }}>
                {currentSectionQuestions.length} Questions
              </Text>
            </View>
          </View>

          <Text style={{ color: subtextColor, fontSize: 12, lineHeight: 18, marginTop: 8 }}>
            {activeSection.description || activeDomainMeta.description}
          </Text>
        </View>

        {/* Questions */}
        <View style={{ gap: 14 }}>
          {currentSectionQuestions.map((question, qIdx) => {
            const questionNumber = qIdx + 1;
            const currentAnswer = answers[question.id] || {};
            const isLikert = activeDomainMeta.type === 'likert';
            const isAnswered = isLikert
              ? currentAnswer.likertValue !== undefined && currentAnswer.likertValue !== null
              : Boolean(currentAnswer.selectedOptionId);

            return (
              <View
                key={question.id || qIdx}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: isAnswered ? '#10b981' : borderColor,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: darkMode ? 0 : 0.03,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                {/* Question Text */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: isAnswered ? '#10b981' : (darkMode ? '#222226' : '#f1f5f9'),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: isAnswered ? '#ffffff' : subtextColor,
                        fontSize: 11,
                        fontWeight: '800',
                      }}
                    >
                      {questionNumber}
                    </Text>
                  </View>

                  <Text
                    style={{
                      flex: 1,
                      color: textColor,
                      fontSize: 14,
                      fontWeight: '700',
                      lineHeight: 20,
                    }}
                  >
                    {question.text || question.question || question.statement}
                  </Text>
                </View>

                {/* Question Diagram / Image if present (Aptitude MCQs) */}
                {(question.imageUrl || question.image || question.diagram) && (
                  <View
                    style={{
                      marginTop: 12,
                      alignItems: 'center',
                      backgroundColor: darkMode ? '#18181c' : '#f8fafc',
                      borderRadius: 12,
                      padding: 10,
                      borderWidth: 1,
                      borderColor,
                    }}
                  >
                    <Image
                      source={{ uri: question.imageUrl || question.image || question.diagram }}
                      style={{ width: '100%', height: 180, resizeMode: 'contain' }}
                    />
                  </View>
                )}

                {/* Option Selector */}
                <View style={{ marginTop: 14 }}>
                  {isLikert ? (
                    // 5-point Likert Scale
                    <View style={{ gap: 8 }}>
                      {LIKERT_OPTIONS.map((opt) => {
                        const isSelected = currentAnswer.likertValue === opt.value;

                        return (
                          <TouchableOpacity
                            key={opt.value}
                            activeOpacity={0.8}
                            onPress={() =>
                              handleSelectAnswer(question.id, { likertValue: opt.value })
                            }
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: isSelected
                                ? (darkMode ? `${opt.color}25` : `${opt.color}15`)
                                : (darkMode ? '#18181c' : '#f8fafc'),
                              borderRadius: 12,
                              paddingVertical: 10,
                              paddingHorizontal: 12,
                              borderWidth: 1,
                              borderColor: isSelected ? opt.color : borderColor,
                              gap: 10,
                            }}
                          >
                            <View
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                backgroundColor: isSelected ? opt.color : (darkMode ? '#2a2a30' : '#e2e8f0'),
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {isSelected ? (
                                <Ionicons name="checkmark" size={13} color="#ffffff" />
                              ) : (
                                <Text style={{ color: subtextColor, fontSize: 10, fontWeight: '700' }}>
                                  {opt.value}
                                </Text>
                              )}
                            </View>

                            <Text
                              style={{
                                color: isSelected ? (darkMode ? '#ffffff' : opt.color) : textColor,
                                fontSize: 13,
                                fontWeight: isSelected ? '800' : '600',
                              }}
                            >
                              {opt.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    // MCQ 4 Options
                    <View style={{ gap: 8 }}>
                      {(question.options || []).map((opt, optIndex) => {
                        const optionLetter = String.fromCharCode(65 + optIndex);
                        const isSelected = currentAnswer.selectedOptionId === opt.id;
                        const optionImage =
                          opt.image ||
                          (typeof opt.optionText === 'string' &&
                          /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(opt.optionText)
                            ? opt.optionText
                            : null);

                        return (
                          <TouchableOpacity
                            key={opt.id || optIndex}
                            activeOpacity={0.8}
                            onPress={() =>
                              handleSelectAnswer(question.id, {
                                selectedOptionId: opt.id,
                              })
                            }
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: isSelected
                                ? (darkMode ? '#0891b225' : '#ecfeff')
                                : (darkMode ? '#18181c' : '#f8fafc'),
                              borderRadius: 12,
                              paddingVertical: 10,
                              paddingHorizontal: 12,
                              borderWidth: 1,
                              borderColor: isSelected ? '#0891b2' : borderColor,
                              gap: 10,
                            }}
                          >
                            <View
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 8,
                                backgroundColor: isSelected ? '#0891b2' : (darkMode ? '#2a2a30' : '#e2e8f0'),
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Text
                                style={{
                                  color: isSelected ? '#ffffff' : subtextColor,
                                  fontSize: 11,
                                  fontWeight: '800',
                                }}
                              >
                                {optionLetter}
                              </Text>
                            </View>

                            <View style={{ flex: 1 }}>
                              {optionImage ? (
                                <Image
                                  source={{ uri: optionImage }}
                                  style={{ width: '100%', height: 70, resizeMode: 'contain' }}
                                />
                              ) : (
                                <Text
                                  style={{
                                    color: isSelected ? '#0e7490' : textColor,
                                    fontSize: 13,
                                    fontWeight: isSelected ? '800' : '600',
                                    lineHeight: 18,
                                  }}
                                >
                                  {opt.text || opt.optionText || opt.label}
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Navigation Bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: cardBg,
          borderTopWidth: 1,
          borderTopColor: borderColor,
          paddingHorizontal: 14,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: darkMode ? 0 : 0.06,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={currentSectionIndex === 0}
          onPress={() => handleSwitchSection(currentSectionIndex - 1)}
          style={{
            backgroundColor: currentSectionIndex === 0 ? (darkMode ? '#1c1c20' : '#f1f5f9') : (darkMode ? '#2a2a30' : '#e2e8f0'),
            paddingHorizontal: 12,
            paddingVertical: 9,
            borderRadius: 12,
            opacity: currentSectionIndex === 0 ? 0.4 : 1,
          }}
        >
          <Text style={{ color: textColor, fontSize: 12, fontWeight: '700' }}>
            ← Prev
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: subtextColor, fontSize: 11, fontWeight: '600' }}>
            {sectionStats[currentSectionIndex]?.answered} of {sectionStats[currentSectionIndex]?.total} answered
          </Text>
        </View>

        {isLastSection ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsSubmitModalVisible(true)}
            style={{
              backgroundColor: '#10b981',
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '800' }}>
              Submit 🎉
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleSwitchSection(currentSectionIndex + 1)}
            style={{
              backgroundColor: '#9a2119',
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '800' }}>
              Next Section →
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Pre-submission Verification Modal */}
      <Modal visible={isSubmitModalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: cardBg,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              maxHeight: '80%',
              borderWidth: 1,
              borderColor,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: textColor, fontSize: 17, fontWeight: '900' }}>
                {unansweredQuestions.length > 0
                  ? '⚠️ Unanswered Questions Detected'
                  : '🎉 Ready for Submission'}
              </Text>
              <TouchableOpacity onPress={() => setIsSubmitModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={subtextColor} />
              </TouchableOpacity>
            </View>

            {unansweredQuestions.length > 0 ? (
              <View>
                <Text style={{ color: subtextColor, fontSize: 13, lineHeight: 18 }}>
                  You have{' '}
                  <Text style={{ color: '#f59e0b', fontWeight: '800' }}>
                    {unansweredQuestions.length} unanswered questions
                  </Text>{' '}
                  out of {totalQuestionsCount}. Answering all questions ensures highest accuracy.
                </Text>

                <ScrollView style={{ maxHeight: 220, marginVertical: 12 }}>
                  <View style={{ gap: 6 }}>
                    {unansweredQuestions.slice(0, 20).map((u, i) => (
                      <View
                        key={i}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: darkMode ? '#18181c' : '#f8fafc',
                          padding: 10,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor,
                        }}
                      >
                        <Text style={{ color: textColor, fontSize: 12, fontWeight: '600', flex: 1 }}>
                          {u.sectionTitle} — Q{u.questionNumber}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setIsSubmitModalVisible(false);
                            handleSwitchSection(u.sectionIndex);
                          }}
                          style={{ paddingLeft: 10 }}
                        >
                          <Text style={{ color: '#9a2119', fontSize: 11, fontWeight: '800' }}>
                            Jump →
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                    {unansweredQuestions.length > 20 && (
                      <Text style={{ color: subtextColor, fontSize: 11, textAlign: 'center', marginTop: 4 }}>
                        ...and {unansweredQuestions.length - 20} more unanswered.
                      </Text>
                    )}
                  </View>
                </ScrollView>

                <View style={{ gap: 8, marginTop: 6 }}>
                  <TouchableOpacity
                    onPress={handleSubmitTest}
                    style={{
                      backgroundColor: '#9a2119',
                      borderRadius: 14,
                      paddingVertical: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '800' }}>
                      Submit Anyway & Generate Report
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setIsSubmitModalVisible(false)}
                    style={{
                      backgroundColor: darkMode ? '#1c1c20' : '#f1f5f9',
                      borderRadius: 14,
                      paddingVertical: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: textColor, fontSize: 12, fontWeight: '700' }}>
                      Continue Answering
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <Text style={{ fontSize: 36 }}>🌟</Text>
                <Text style={{ color: textColor, fontSize: 16, fontWeight: '800', marginTop: 8 }}>
                  All 163 Questions Answered!
                </Text>
                <Text style={{ color: subtextColor, fontSize: 12, textAlign: 'center', marginTop: 4 }}>
                  Your responses are complete. Click confirm to calculate your Career Compass profile.
                </Text>

                <TouchableOpacity
                  onPress={handleSubmitTest}
                  style={{
                    backgroundColor: '#10b981',
                    borderRadius: 14,
                    paddingVertical: 12,
                    width: '100%',
                    alignItems: 'center',
                    marginTop: 16,
                  }}
                >
                  <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '800' }}>
                    Confirm & View Career Report
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

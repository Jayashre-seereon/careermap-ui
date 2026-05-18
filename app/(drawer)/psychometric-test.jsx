import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Share, Text, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';
import { AnimatedPressable, Screen } from '../../src/careermap-ui';

const answerScale = [
  { label: 'Strongly Agree', value: 5 },
  { label: 'Agree', value: 4 },
  { label: 'Neutral', value: 3 },
  { label: 'Disagree', value: 2 },
  { label: 'Strongly Disagree', value: 1 },
];

const assessmentModules = [
  {
    key: 'interest',
    title: 'Interest',
    icon: 'sparkles-outline',
    color: '#b12d1f',
    summary: 'Explores the activities and subjects that naturally hold your attention.',
    questions: [
      'I enjoy exploring new subjects even outside my school syllabus.',
      'I feel excited when I discover how a profession works in real life.',
      'I prefer tasks that connect with my personal passions and curiosity.',
      'I like spending time on projects related to careers I admire.',
      'I actively look for opportunities to learn about different fields.',
    ],
  },
  {
    key: 'personality',
    title: 'Personality',
    icon: 'happy-outline',
    color: '#c4502c',
    summary: 'Looks at how you behave, respond, and work with others.',
    questions: [
      'I stay calm and steady when I face pressure or deadlines.',
      'I enjoy working with people and building new connections.',
      'I usually take initiative instead of waiting for instructions.',
      'I adapt quickly when plans or expectations suddenly change.',
      'I like expressing my thoughts openly in group discussions.',
    ],
  },
  {
    key: 'goal-orientation',
    title: 'Goal Orientation',
    icon: 'flag-outline',
    color: '#9b1d24',
    summary: 'Measures your motivation, persistence, and focus on outcomes.',
    questions: [
      'I set clear goals for myself and track my progress regularly.',
      'I keep working on tasks even when they become difficult.',
      'I feel motivated by achieving measurable outcomes.',
      'I break big goals into smaller milestones and deadlines.',
      'I recover quickly after setbacks and continue moving forward.',
    ],
  },
  {
    key: 'aptitude',
    title: 'Aptitude',
    icon: 'analytics-outline',
    color: '#8f2f1f',
    summary: 'Assesses how comfortable you are with reasoning and problem solving.',
    questions: [
      'I enjoy solving puzzles, patterns, or logic-based questions.',
      'I can quickly understand charts, data, or number-based information.',
      'I like comparing different solutions before making a choice.',
      'I can identify mistakes or inconsistencies in information easily.',
      'I enjoy tasks that require structured thinking and accuracy.',
    ],
  },
  {
    key: 'learning-style',
    title: 'Learning Style',
    icon: 'book-outline',
    color: '#b56a2f',
    summary: 'Shows how you best absorb, practice, and retain information.',
    questions: [
      'I learn best when I can see examples, diagrams, or demonstrations.',
      'I remember concepts better after discussing them with someone.',
      'I prefer hands-on practice instead of only reading theory.',
      'I stay engaged when learning is interactive and activity-based.',
      'I revise more effectively when I organize notes in my own way.',
    ],
  },
  {
    key: 'work-values',
    title: 'Work Values',
    icon: 'briefcase-outline',
    color: '#7a2b20',
    summary: 'Highlights what matters most to you in a future career environment.',
    questions: [
      'I want a career that creates a positive impact on others.',
      'I value long-term job security when thinking about career choices.',
      'I want enough freedom to make independent decisions in my work.',
      'I care about work-life balance as much as career growth.',
      'I feel motivated by roles where effort is recognized and rewarded.',
    ],
  },
];

const moduleInsights = {
  interest: {
    strong: 'You are driven by curiosity and naturally lean toward exploratory career paths.',
    moderate: 'Your interests are emerging well, and more exposure can sharpen your direction.',
    low: 'You may need broader exposure to subjects and careers to clarify what energizes you most.',
  },
  personality: {
    strong: 'Your personal style shows confidence and adaptability across team and individual settings.',
    moderate: 'You show balanced traits and can grow strongly with the right environment.',
    low: 'A more guided environment may help you build confidence and communication habits.',
  },
  'goal-orientation': {
    strong: 'You are highly motivated and likely to stay committed to long-term goals.',
    moderate: 'You have a healthy level of drive and can benefit from stronger planning habits.',
    low: 'You may do better with shorter milestones, structure, and accountability support.',
  },
  aptitude: {
    strong: 'You appear comfortable with reasoning, structured thinking, and analytical problem solving.',
    moderate: 'You have a workable foundation and can improve with regular practice.',
    low: 'You may benefit from skill-building in logic, data handling, and step-by-step analysis.',
  },
  'learning-style': {
    strong: 'You understand how you learn best and can likely adapt your study methods well.',
    moderate: 'You show flexible learning habits and can improve with more deliberate study systems.',
    low: 'Experimenting with study formats may help you discover methods that suit you better.',
  },
  'work-values': {
    strong: 'You have clear internal values that can guide meaningful career decisions.',
    moderate: 'Your work values are taking shape and will become clearer with more experience.',
    low: 'You may need more reflection on what kind of work environment matters most to you.',
  },
};

const moduleReportLibrary = {
  interest: {
    overview:
      'Your interests are the areas, activities, or subjects that capture your attention and energy. They reflect what you enjoy doing, what you are naturally curious about, and what keeps you motivated.',
    dimensions: [
      {
        title: 'Curiosity & Exploration',
        summary: 'You enjoy discovering new topics, testing ideas, and expanding your awareness of possible career directions.',
        traits: ['Curious', 'Open-minded', 'Exploratory', 'Growth oriented'],
        enjoys: ['Trying new subjects', 'Researching options', 'Learning from examples'],
        environments: ['Discovery-based', 'Flexible', 'Idea-friendly'],
      },
      {
        title: 'Career Engagement',
        summary: 'You are motivated when learning feels connected to real professions, future goals, and meaningful application.',
        traits: ['Purpose driven', 'Aware', 'Future focused', 'Motivated'],
        enjoys: ['Career stories', 'Project-based learning', 'Applied activities'],
        environments: ['Practical', 'Mentored', 'Career-linked'],
      },
      {
        title: 'Passion Alignment',
        summary: 'You prefer pathways that feel personally meaningful rather than purely routine or externally imposed.',
        traits: ['Self-aware', 'Value conscious', 'Inspired', 'Authentic'],
        enjoys: ['Purposeful goals', 'Choice-led learning', 'Personal expression'],
        environments: ['Supportive', 'Interest-led', 'Encouraging'],
      },
    ],
    careers: [
      'Career Research Analyst',
      'Content Creator',
      'Education Counsellor',
      'Innovation Associate',
      'Learning Experience Designer',
      'Student Mentor',
    ],
  },
  personality: {
    overview:
      'Personality helps explain how you respond to people, pressure, and change. It gives clues about the kinds of work settings where you may feel most comfortable and effective.',
    dimensions: [
      {
        title: 'Social Expression',
        summary: 'This reflects how comfortable you are interacting, speaking up, and building connections with others.',
        traits: ['Expressive', 'Collaborative', 'Friendly', 'Approachable'],
        enjoys: ['Group discussions', 'Meeting people', 'Shared work'],
        environments: ['Team-based', 'Interactive', 'People centric'],
      },
      {
        title: 'Adaptability',
        summary: 'Adaptability indicates how well you adjust when plans change or when expectations become uncertain.',
        traits: ['Flexible', 'Resilient', 'Responsive', 'Calm'],
        enjoys: ['Varied tasks', 'New challenges', 'Dynamic settings'],
        environments: ['Fast-paced', 'Changing', 'Opportunity rich'],
      },
      {
        title: 'Initiative & Presence',
        summary: 'This dimension highlights whether you tend to take the lead and move work forward without waiting too long.',
        traits: ['Proactive', 'Confident', 'Action-oriented', 'Visible'],
        enjoys: ['Leading activities', 'Starting tasks', 'Owning outcomes'],
        environments: ['Empowering', 'Independent', 'Leadership friendly'],
      },
    ],
    careers: [
      'Human Resources Executive',
      'Teacher',
      'Public Relations Associate',
      'Client Success Manager',
      'Counsellor',
      'Team Coordinator',
    ],
  },
  'goal-orientation': {
    overview:
      'Goal orientation measures how focused, persistent, and outcome-driven you are. It reflects how strongly you work toward targets and how you respond when progress takes time.',
    dimensions: [
      {
        title: 'Achievement Drive',
        summary: 'This reflects how strongly you are motivated by targets, growth, and a clear sense of progress.',
        traits: ['Ambitious', 'Focused', 'Driven', 'Competitive'],
        enjoys: ['Goal tracking', 'Milestones', 'Visible progress'],
        environments: ['Performance based', 'Structured', 'Growth oriented'],
      },
      {
        title: 'Persistence',
        summary: 'Persistence shows your willingness to keep working when tasks become difficult or slower than expected.',
        traits: ['Patient', 'Steady', 'Committed', 'Responsible'],
        enjoys: ['Long-term projects', 'Skill building', 'Problem solving'],
        environments: ['Supportive', 'Challenging', 'Disciplined'],
      },
      {
        title: 'Planning Habits',
        summary: 'Planning habits describe how effectively you break large goals into manageable next steps.',
        traits: ['Organized', 'Methodical', 'Intentional', 'Reliable'],
        enjoys: ['Scheduling', 'Checklists', 'Prioritizing work'],
        environments: ['Clear', 'Orderly', 'Process friendly'],
      },
    ],
    careers: [
      'Project Coordinator',
      'Operations Executive',
      'Business Analyst',
      'Program Manager',
      'Administrative Officer',
      'Exam Strategy Mentor',
    ],
  },
  aptitude: {
    overview:
      'Aptitude reflects your comfort with logic, analysis, and structured problem-solving. It offers a view into how naturally you may handle accuracy, reasoning, and information processing tasks.',
    dimensions: [
      {
        title: 'Analytical Reasoning',
        summary: 'This measures how well you think through problems and compare possibilities before deciding.',
        traits: ['Logical', 'Analytical', 'Careful', 'Thoughtful'],
        enjoys: ['Patterns', 'Analysis', 'Evidence-based thinking'],
        environments: ['Structured', 'Intellectually challenging', 'Systematic'],
      },
      {
        title: 'Data Comfort',
        summary: 'Data comfort shows how confident you feel around numbers, charts, and measurable information.',
        traits: ['Precise', 'Observant', 'Numerate', 'Accurate'],
        enjoys: ['Reports', 'Metrics', 'Comparisons'],
        environments: ['Data-rich', 'Measured', 'Objective'],
      },
      {
        title: 'Error Detection',
        summary: 'This indicates how easily you notice inconsistencies, weak assumptions, or missing details.',
        traits: ['Detail-oriented', 'Focused', 'Critical thinker', 'Thorough'],
        enjoys: ['Reviewing', 'Checking quality', 'Improving systems'],
        environments: ['Quality-driven', 'Careful', 'Standards based'],
      },
    ],
    careers: [
      'Data Analyst',
      'Engineer',
      'Financial Analyst',
      'Research Assistant',
      'Quality Analyst',
      'Software Tester',
    ],
  },
  'learning-style': {
    overview:
      'Learning style explains how you understand, retain, and apply information most effectively. Knowing this helps you choose better study methods and work settings.',
    dimensions: [
      {
        title: 'Visual Understanding',
        summary: 'You may learn more effectively when concepts are shown through diagrams, models, and examples.',
        traits: ['Observational', 'Pattern aware', 'Image-friendly', 'Conceptual'],
        enjoys: ['Charts', 'Maps', 'Illustrations'],
        environments: ['Visual', 'Demonstration-led', 'Organized'],
      },
      {
        title: 'Interactive Learning',
        summary: 'This shows whether discussion, feedback, and participation help you absorb information better.',
        traits: ['Participative', 'Verbal', 'Collaborative', 'Responsive'],
        enjoys: ['Discussion', 'Questioning', 'Explaining ideas'],
        environments: ['Interactive', 'Feedback rich', 'Group supported'],
      },
      {
        title: 'Practical Retention',
        summary: 'Practical retention reflects how strongly hands-on work helps you remember and master concepts.',
        traits: ['Hands-on', 'Applied', 'Action-based', 'Pragmatic'],
        enjoys: ['Doing', 'Practice tasks', 'Simulations'],
        environments: ['Applied', 'Workshop style', 'Practice driven'],
      },
    ],
    careers: [
      'Trainer',
      'Instructional Designer',
      'UX Researcher',
      'Lab Assistant',
      'Workshop Facilitator',
      'Academic Coach',
    ],
  },
  'work-values': {
    overview:
      'Work values describe what matters most to you in a future career, such as impact, stability, freedom, balance, or recognition. These values often drive long-term satisfaction and career fit.',
    dimensions: [
      {
        title: 'Purpose & Impact',
        summary: 'This shows how strongly you care about doing work that benefits people or creates meaningful change.',
        traits: ['Purposeful', 'Empathetic', 'Socially aware', 'Conscientious'],
        enjoys: ['Helping others', 'Making a difference', 'Meaningful service'],
        environments: ['Mission-led', 'Supportive', 'Impact focused'],
      },
      {
        title: 'Security & Stability',
        summary: 'Security and stability reflect your preference for dependable roles and predictable long-term pathways.',
        traits: ['Steady', 'Practical', 'Responsible', 'Grounded'],
        enjoys: ['Consistency', 'Reliable systems', 'Clear structures'],
        environments: ['Stable', 'Organized', 'Policy driven'],
      },
      {
        title: 'Freedom & Balance',
        summary: 'This dimension highlights your need for autonomy, flexibility, and a healthy balance between work and life.',
        traits: ['Independent', 'Self-directed', 'Balanced', 'Thoughtful'],
        enjoys: ['Choice', 'Flexible work', 'Personal space'],
        environments: ['Autonomous', 'Respectful', 'Flexible'],
      },
    ],
    careers: [
      'Social Impact Associate',
      'Government Services Officer',
      'NGO Program Executive',
      'Wellness Counsellor',
      'Corporate Communications Executive',
      'Community Development Associate',
    ],
  },
};

function createInitialAnswers() {
  return assessmentModules.map((module) => module.questions.map(() => null));
}

function normalizeAnswers(answers) {
  return assessmentModules.map((module, moduleIndex) => {
    const moduleAnswers = Array.isArray(answers?.[moduleIndex]) ? answers[moduleIndex] : [];
    return module.questions.map((_, questionIndex) => moduleAnswers[questionIndex] ?? null);
  });
}

function getBand(score, maxScore) {
  const ratio = score / maxScore;
  if (ratio >= 0.8) {
    return 'strong';
  }
  if (ratio >= 0.55) {
    return 'moderate';
  }
  return 'low';
}

function toTitleCase(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildReportFromAnswers(answers) {
  const safeAnswers = normalizeAnswers(answers);
  const modules = assessmentModules.map((module, moduleIndex) => {
    const moduleAnswers = safeAnswers[moduleIndex];
    const score = moduleAnswers.reduce((sum, value) => sum + (value || 0), 0);
    const maxScore = module.questions.length * 5;
    const percentage = Math.round((score / maxScore) * 100);
    const band = getBand(score, maxScore);

    return {
      ...module,
      score,
      maxScore,
      percentage,
      band,
      insight: moduleInsights[module.key][band],
    };
  });

  const topModule = [...modules].sort((a, b) => b.score - a.score)[0];
  const overallScore = modules.reduce((sum, module) => sum + module.score, 0);
  const overallMax = modules.reduce((sum, module) => sum + module.maxScore, 0);
  const overallPercent = Math.round((overallScore / overallMax) * 100);

  return {
    modules,
    topModule,
    overallScore,
    overallMax,
    overallPercent,
  };
}

function buildDimensionScore(module, index) {
  const base = Math.max(2, Math.round(module.score / 3));
  return Math.min(5, Math.max(1, base + (index === 1 ? 0 : index === 2 ? -1 : 1)));
}

function ProgressBar({ value, color = palette.primary }) {
  return (
    <View className="h-2 overflow-hidden rounded-full bg-[#f0ddd8]">
      <View className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
    </View>
  );
}

export default function PsychometricTestScreen() {
  const { addTestHistory, isUnlocked, preferences } = useAppState();
  const [currentModule, setCurrentModule] = useState(0);
  const [stage, setStage] = useState('questions');
  const [reportMode, setReportMode] = useState('single');
  const [selectedReportModule, setSelectedReportModule] = useState('interest');
  const [answers, setAnswers] = useState(createInitialAnswers);

  const safeAnswers = normalizeAnswers(answers);
  const safeCurrentModule = Math.min(Math.max(currentModule, 0), assessmentModules.length - 1);
  const totalQuestions = assessmentModules.reduce((sum, module) => sum + module.questions.length, 0);
  const answeredCount = safeAnswers.flat().filter((value) => value !== null).length;
  const percentComplete = Math.round((answeredCount / totalQuestions) * 100);
  const activeModule = assessmentModules[safeCurrentModule];
  const activeAnswers = safeAnswers[safeCurrentModule];
  const moduleComplete = activeAnswers.every((value) => value !== null);
  const isLastModule = safeCurrentModule === assessmentModules.length - 1;
  const report = useMemo(() => buildReportFromAnswers(safeAnswers), [safeAnswers]);

  const cardClassName = preferences.darkMode
    ? 'rounded-[24px] border border-[#1a1a1a] bg-[#080808]'
    : 'rounded-[24px] border border-[#e8dfda] bg-card';

  function goToAssessmentHome() {
    router.replace('/(drawer)/(tabs)/assessment');
  }

  function handleBack() {
    if (stage === 'result') {
      goToAssessmentHome();
      return;
    }

    if (safeCurrentModule > 0) {
      setCurrentModule((value) => value - 1);
      return;
    }

    goToAssessmentHome();
  }

  function finishAssessment(finalAnswers = safeAnswers, finalReport = report) {
    addTestHistory({
      id: `psychometric-${Date.now()}`,
      title: 'Full Assessment Report',
      subtitle: `Completed on ${new Date().toLocaleDateString('en-IN')} - Overall score ${finalReport.overallPercent}%`,
      status: 'Report Ready',
    });
    setAnswers(finalAnswers);
    setSelectedReportModule('interest');
    setReportMode('single');
    setStage('result');
  }

  function handleAnswerChange(questionIndex, value) {
    const nextAnswers = safeAnswers.map((moduleAnswers, moduleIndex) =>
      moduleIndex === safeCurrentModule
        ? moduleAnswers.map((answer, index) => (index === questionIndex ? value : answer))
        : moduleAnswers
    );

    setAnswers(nextAnswers);

    const nextModuleAnswers = nextAnswers[safeCurrentModule];
    const nextModuleComplete = nextModuleAnswers.every((answer) => answer !== null);

    if (!nextModuleComplete) {
      return;
    }

    if (safeCurrentModule === assessmentModules.length - 1) {
      const finalReport = buildReportFromAnswers(nextAnswers);
      finishAssessment(nextAnswers, finalReport);
      return;
    }

    setCurrentModule((moduleIndex) => moduleIndex + 1);
  }

  function handleNext() {
    if (!moduleComplete) {
      Alert.alert('Complete this module', 'Please answer all questions in this module before continuing.');
      return;
    }

    if (isLastModule) {
      finishAssessment();
      return;
    }

    setCurrentModule((value) => value + 1);
  }

  async function handleDownloadReport() {
    try {
      const moduleRows = report.modules
        .map(
          (module) =>
            `${module.title}: ${module.score}/${module.maxScore} (${module.percentage}%) - ${toTitleCase(module.band)}`
        )
        .join('\n');

      const reportText = [
        'CareerMap Assessment Results',
        `Generated on ${new Date().toLocaleString('en-IN')}`,
        '',
        `Overall score: ${report.overallScore}/${report.overallMax} (${report.overallPercent}%)`,
        `Strongest module: ${report.topModule.title}`,
        report.topModule.insight,
        '',
        'Module Summary',
        moduleRows,
      ].join('\n');

      await Share.share({
        title: 'CareerMap Assessment Report',
        message: reportText,
      });
    } catch {
      Alert.alert('Unable to share', 'The report could not be shared right now.');
    }
  }

  if (!isUnlocked('psychometric-test')) {
    return (
      <Screen animationKey="psychometric-locked">
        <View className="px-1 pb-8 pt-3">
          <View className="mb-7 flex-row items-center gap-3">
            <AnimatedPressable
              onPress={handleBack}
              className={`h-10 w-10 items-center justify-center rounded-full ${preferences.darkMode ? 'bg-[#111111]' : 'bg-white'}`}
            >
              <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text} />
            </AnimatedPressable>
            <Text className={`text-[22px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Psychometric Test Locked</Text>
          </View>

          <View className={`${cardClassName} items-center gap-3 p-[22px]`}>
            <View className="h-[78px] w-[78px] items-center justify-center rounded-[24px] bg-[#ffecef]">
              <Ionicons name="lock-closed-outline" size={34} color={palette.primary} />
            </View>
            <Text className={`text-center text-[20px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
              Subscribe to continue with the full psychometric test.
            </Text>
            <Text className={`text-center text-[14px] leading-[22px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
              Unlock the same guided multi-module test, report summary, and career recommendation flow from the user portal.
            </Text>
            <AnimatedPressable className="mt-2 rounded-[16px] bg-brand px-5 py-3" onPress={() => router.push({ pathname: '/checkout', params: { planId: 'psychometric' } })}>
              <Text className="text-[14px] font-extrabold text-white">Unlock Full Test</Text>
            </AnimatedPressable>
          </View>
        </View>
      </Screen>
    );
  }

  if (stage === 'result') {
    const visibleModules =
      reportMode === 'all'
        ? report.modules
        : report.modules.filter((module) => module.key === selectedReportModule);

    return (
      <Screen animationKey="psychometric-results">
        <View className="px-1 pb-8 pt-3">
          <View className="mb-6 flex-row items-center gap-3">
            <AnimatedPressable
              onPress={handleBack}
              className={`h-10 w-10 items-center justify-center rounded-full ${preferences.darkMode ? 'bg-[#111111]' : 'bg-white'}`}
            >
              <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text} />
            </AnimatedPressable>
            <Text className={`flex-1 text-[22px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Assessment Results</Text>
          </View>

          <View className={`${cardClassName} gap-4 p-5`}>
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="text-[12px] font-bold uppercase tracking-[1px] text-brand">Full Report</Text>
                <Text className={`mt-1 text-[28px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{report.overallPercent}%</Text>
                <Text className={`mt-1 text-[14px] leading-6 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                  Strongest module: {report.topModule.title}. {report.topModule.insight}
                </Text>
              </View>
              <View className="rounded-[20px] bg-[#fff2ef] px-4 py-3">
                <Text className="text-[12px] font-bold text-brand">Score</Text>
                <Text className="text-[18px] font-extrabold text-brand">
                  {report.overallScore}/{report.overallMax}
                </Text>
              </View>
            </View>

            <ProgressBar value={report.overallPercent} color={palette.primary} />

            <View className="flex-row gap-3">
              <AnimatedPressable
                className={`flex-1 items-center rounded-[16px] border px-4 py-3 ${reportMode === 'all' ? 'border-brand bg-[#fff2ef]' : preferences.darkMode ? 'border-[#1f1f1f] bg-[#121212]' : 'border-[#e8dfda] bg-white'}`}
                onPress={() => setReportMode('all')}
              >
                <Text className={`text-[13px] font-extrabold ${reportMode === 'all' ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>View All Report</Text>
              </AnimatedPressable>
              <AnimatedPressable className="flex-1 items-center rounded-[16px] bg-brand px-4 py-3" onPress={handleDownloadReport}>
                <Text className="text-[13px] font-extrabold text-white">Download Report</Text>
              </AnimatedPressable>
            </View>
          </View>

          <View className="mt-4 flex-row flex-wrap gap-2">
            {report.modules.map((module) => {
              const active = reportMode === 'single' && selectedReportModule === module.key;
              return (
                <AnimatedPressable
                  key={module.key}
                  className={`rounded-full px-4 py-2.5 ${active ? 'bg-[#fff0ed]' : preferences.darkMode ? 'bg-[#101013]' : 'bg-white'}`}
                  onPress={() => {
                    setReportMode('single');
                    setSelectedReportModule(module.key);
                  }}
                >
                  <Text className={`text-[12px] font-bold ${active ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{module.title}</Text>
                </AnimatedPressable>
              );
            })}
          </View>

          <View className="mt-4 gap-4">
            {visibleModules.map((module) => {
              const reportContent = moduleReportLibrary[module.key];
              return (
                <View key={module.key} className={`${cardClassName} gap-4 p-5`}>
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1 flex-row items-center gap-3">
                      <View className="h-12 w-12 items-center justify-center rounded-[16px]" style={{ backgroundColor: `${module.color}18` }}>
                        <Ionicons name={module.icon} size={22} color={module.color} />
                      </View>
                      <View className="flex-1">
                        <Text className={`text-[20px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{module.title}</Text>
                        <Text className="text-[12px] font-bold" style={{ color: module.color }}>
                          {toTitleCase(module.band)} profile
                        </Text>
                      </View>
                    </View>
                    <View className="rounded-[18px] bg-[#f8fbff] px-3 py-2">
                      <Text className="text-[11px] font-bold text-brand">Module Score</Text>
                      <Text className="text-[16px] font-extrabold text-brand">
                        {module.score}/{module.maxScore}
                      </Text>
                    </View>
                  </View>

                  <ProgressBar value={module.percentage} color={module.color} />

                  <View className={`rounded-[18px] px-4 py-4 ${preferences.darkMode ? 'bg-[#101013]' : 'bg-[#fff6f4]'}`}>
                    <Text className="text-[13px] font-extrabold text-brand">Description</Text>
                    <Text className={`mt-2 text-[14px] leading-6 ${preferences.darkMode ? 'text-[#d7cfd7]' : 'text-[#5f514d]'}`}>{reportContent.overview}</Text>
                  </View>

                  <View className="gap-3">
                    {reportContent.dimensions.map((dimension, index) => (
                      <View
                        key={dimension.title}
                        className={`rounded-[20px] border px-4 py-4 ${preferences.darkMode ? 'border-[#1f1f1f] bg-[#101013]' : 'border-[#ede3df] bg-white'}`}
                      >
                        <Text className={`text-[16px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{dimension.title}</Text>
                        <Text className="mt-1 text-[12px] font-bold" style={{ color: module.color }}>
                          Average Score: {buildDimensionScore(module, index)}
                        </Text>
                        <Text className={`mt-2 text-[14px] leading-6 ${preferences.darkMode ? 'text-[#d7cfd7]' : 'text-[#4f4340]'}`}>{dimension.summary}</Text>
                        <Text className={`mt-2 text-[14px] leading-6 ${preferences.darkMode ? 'text-[#d7cfd7]' : 'text-[#4f4340]'}`}>{module.insight}</Text>
                        <Text className={`mt-3 text-[13px] leading-6 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                          Traits: {dimension.traits.join(', ')}
                        </Text>
                        <Text className={`text-[13px] leading-6 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                          Enjoys: {dimension.enjoys.join(', ')}
                        </Text>
                        <Text className={`text-[13px] leading-6 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                          Ideal Environments: {dimension.environments.join(', ')}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View className={`rounded-[20px] px-4 py-4 ${preferences.darkMode ? 'bg-[#101013]' : 'bg-[#fff9f7]'}`}>
                    <Text className={`text-[18px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Suggested Career Paths</Text>
                    <View className="mt-3 gap-2">
                      {reportContent.careers.map((career, index) => (
                        <View key={career} className="flex-row items-start gap-3">
                          <View className="mt-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: module.color }} />
                          <Text className={`flex-1 text-[14px] leading-6 ${preferences.darkMode ? 'text-[#d7cfd7]' : 'text-[#4f4340]'}`}>
                            {index + 1}. {career}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

        </View>
      </Screen>
    );
  }

  return (
    <Screen animationKey={`psychometric-module-${safeCurrentModule}`}>
      <View className="px-1 pb-8 pt-3">
        <View className="mb-6 flex-row items-center gap-3">
          <AnimatedPressable
            onPress={handleBack}
            className={`h-10 w-10 items-center justify-center rounded-full ${preferences.darkMode ? 'bg-[#111111]' : 'bg-white'}`}
          >
            <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text} />
          </AnimatedPressable>
          <View className="flex-1">
            <Text className="text-[12px] font-bold uppercase tracking-[1px] text-brand">Full Assessment</Text>
            <Text className={`text-[22px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Psychometric Test</Text>
          </View>
          <Text className="text-[12px] font-extrabold text-brand">{percentComplete}%</Text>
        </View>

        <View className={`${cardClassName} gap-4 p-5`}>
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className={`text-[18px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{activeModule.title}</Text>
              <Text className={`mt-1 text-[14px] leading-6 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{activeModule.summary}</Text>
            </View>
            <View className="rounded-[18px] bg-[#fff2ef] px-3 py-2">
              <Text className="text-[11px] font-bold text-brand">
                {answeredCount}/{totalQuestions} answered
              </Text>
            </View>
          </View>

          <ProgressBar value={percentComplete} color={palette.primary} />

          <View className="flex-row flex-wrap justify-between gap-y-3">
            {assessmentModules.map((module, index) => {
              const completedCount = safeAnswers[index].filter((value) => value !== null).length;
              const active = index === safeCurrentModule;
              const done = completedCount === module.questions.length;

              return (
                <View
                  key={module.key}
                  className={`w-[48%] rounded-[18px] border px-3 py-3 ${active ? 'border-brand bg-[#fff0ed]' : preferences.darkMode ? 'border-[#1f1f1f] bg-[#101013]' : 'border-[#e8dfda] bg-white'}`}
                >
                  <Text className={`text-[13px] font-extrabold ${active ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                    {module.title}
                  </Text>
                  <Text className={`mt-0.5 text-[11px] ${done ? 'text-[#2f9367]' : active ? 'text-brand' : preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                    {completedCount}/{module.questions.length} done
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="mt-4 gap-4">
          {activeModule.questions.map((question, questionIndex) => (
            <View key={question} className={`${cardClassName} p-5`}>
              <Text className={`text-[16px] font-extrabold leading-7 ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                Q{questionIndex + 1}. {question}
              </Text>

              <View className="mt-4 gap-3">
                {answerScale.map((option) => {
                  const active = activeAnswers[questionIndex] === option.value;
                  return (
                    <AnimatedPressable
                      key={option.label}
                      className={`rounded-[18px] border px-4 py-4 ${active ? 'border-brand bg-brand' : preferences.darkMode ? 'border-[#1f1f1f] bg-[#101013]' : 'border-[#eadcd6] bg-white'}`}
                      onPress={() => handleAnswerChange(questionIndex, option.value)}
                    >
                      <Text className={`text-[14px] font-bold ${active ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{option.label}</Text>
                    </AnimatedPressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <View className="mt-4 flex-row gap-3">
          <AnimatedPressable
            className={`flex-1 items-center rounded-[16px] border px-4 py-4 ${preferences.darkMode ? 'border-[#1f1f1f] bg-[#101013]' : 'border-[#dfd2cc] bg-white'}`}
            onPress={handleBack}
          >
            <Text className={`text-[14px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
              {safeCurrentModule === 0 ? 'Back to Assessment' : 'Previous Module'}
            </Text>
          </AnimatedPressable>

          <AnimatedPressable className="flex-1 items-center rounded-[16px] bg-brand px-4 py-4" onPress={handleNext}>
            <Text className="text-[14px] font-extrabold text-white">{isLastModule ? 'Finish & View Report' : 'Check & Continue'}</Text>
          </AnimatedPressable>
        </View>
      </View>
    </Screen>
  );
}

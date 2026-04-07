import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppState } from '../src/app-state';
import { BeeMascot } from '../src/bee-mascot';
import { palette } from '../src/careermap-data';

const studentClassOptions = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Graduate'];
const streamOptions = ['Science', 'Commerce', 'Arts & Humanities', 'Vocational', 'Not Sure Yet'];
const interestOptions = ['Technology & Computers', 'Problem Solving', 'Creativity & Design', 'Helping People', 'Business'];
const clarityOptions = [
  'Clear on my goal, need the right path',
  'Choosing between a few options',
  "Confused between my choice and parents' expectations",
  'I keep changing my options',
];
const strengthOptions = ['Analytical Thinking', 'Communication', 'Creativity', 'Leadership', 'Problem-solving'];
const priorityOptions = ['High Earning Potential', 'Passion and Interest', 'Work-Life Balance', 'Growth and Advancement'];
const guidanceOptions = ['Yes, I would like counselling', 'Maybe after an assessment', 'I prefer to explore on my own'];

export default function OnboardingScreen() {
  const { saveOnboarding } = useAppState();
  const [userType, setUserType] = useState<'student' | 'parent' | ''>('');
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [childName, setChildName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedClarity, setSelectedClarity] = useState('');
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedGuidance, setSelectedGuidance] = useState('');

  const totalSteps = 11;
  const progressCount = totalSteps - 2;

  const toggleMulti = (value: string, selected: string[], setSelected: (values: string[]) => void) => {
    setSelected(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  const canProceed = () => {
    if (step === 0) return userType !== '';
    if (step === 2) return name.trim().length > 0;
    if (step === 3) return userType === 'parent' ? childName.trim().length > 0 : selectedClass !== '';
    if (step === 4) return userType === 'parent' ? selectedClass !== '' : selectedStream !== '';
    if (step === 5) return userType === 'parent' ? selectedStream !== '' : selectedInterests.length > 0;
    if (step === 6) return selectedClarity !== '';
    if (step === 7) return selectedStrengths.length > 0;
    if (step === 8) return selectedPriorities.length > 0;
    if (step === 9) return selectedGuidance !== '';
    return true;
  };

  const next = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      return;
    }
    saveOnboarding({
      userType,
      name,
      childName,
      selectedClass,
      selectedStream,
      selectedInterests,
      selectedClarity,
      selectedStrengths,
      selectedPriorities,
      selectedGuidance,
    });
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {step > 0 && step < totalSteps - 1 ? (
          <View style={styles.progressRow}>
            {Array.from({ length: progressCount }).map((_, index) => (
              <View key={index} style={[styles.progressBar, index < step ? styles.progressBarActive : undefined]} />
            ))}
          </View>
        ) : null}

        {step === 0 ? (
          <View style={styles.centered}>
           <BeeMascot size={86} />
            <Text style={styles.title}>Choose Your Way</Text>
            <Text style={styles.subtitle}>Tell us who you are so we can personalize your experience</Text>
            <View style={styles.choiceColumn}>
              <Pressable onPress={() => setUserType('student')} style={[styles.choiceCard, userType === 'student' && styles.choiceCardActive]}>
                <View style={[styles.choiceIcon, userType === 'student' && styles.choiceIconActive]}>
                  <Text style={[styles.choiceIconText, userType === 'student' && styles.choiceIconTextActive]}>S</Text>
                </View>
                <View style={styles.choiceBody}>
                  <Text style={styles.choiceTitle}>I&apos;m a Student</Text>
                  <Text style={styles.choiceSubtitle}>Explore career paths for myself</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setUserType('parent')} style={[styles.choiceCard, userType === 'parent' && styles.choiceCardActive]}>
                <View style={[styles.choiceIcon, userType === 'parent' && styles.choiceIconActive]}>
                  <Text style={[styles.choiceIconText, userType === 'parent' && styles.choiceIconTextActive]}>P</Text>
                </View>
                <View style={styles.choiceBody}>
                  <Text style={styles.choiceTitle}>I&apos;m a Parent</Text>
                  <Text style={styles.choiceSubtitle}>Explore careers for my child</Text>
                </View>
              </Pressable>
            </View>
          </View>
        ) : null}

        {step === 1 ? (
          <View style={styles.centered}>
            <BeeMascot size={68} />
            <Text style={styles.title}>{userType === 'parent' ? 'Welcome, Parent!' : 'Hi! I\'m your Career Guide 👋'}</Text>
            <Text style={styles.subtitle}>
              {userType === 'parent'
                ? "We'll help you explore career options for your child's future."
                : "I'll help you explore the best career path. Let's get started."}
            </Text>
          </View>
        ) : null}

        {step === 2 ? (
          <StepInput title="What's your name?" icon="Name" value={name} setValue={setName} placeholder={userType === 'parent' ? 'Enter your name' : 'Enter your full name'} />
        ) : null}

        {step === 3 && userType === 'student' ? (
          <ChoiceGrid title="Which class are you in?" icon="Class" options={studentClassOptions} selected={selectedClass} onSelect={setSelectedClass} />
        ) : null}

        {step === 3 && userType === 'parent' ? (
          <StepInput title="What's your child's name?" icon="Child" value={childName} setValue={setChildName} placeholder="Enter your child's name" />
        ) : null}

        {step === 4 ? (
          <ChoiceGrid
            title={userType === 'parent' ? 'Which class is your child in?' : 'Which stream interests you?'}
            icon={userType === 'parent' ? 'Class' : 'Stream'}
            options={userType === 'parent' ? studentClassOptions : streamOptions}
            selected={userType === 'parent' ? selectedClass : selectedStream}
            onSelect={userType === 'parent' ? setSelectedClass : setSelectedStream}
          />
        ) : null}

        {step === 5 && userType === 'student' ? (
          <MultiChoice title="What are your interests?" subtitle="Select all that apply" icon="Interests" options={interestOptions} selected={selectedInterests} onToggle={(value) => toggleMulti(value, selectedInterests, setSelectedInterests)} />
        ) : null}

        {step === 5 && userType === 'parent' ? (
          <ChoiceGrid title="Which stream interests your child?" icon="Stream" options={streamOptions} selected={selectedStream} onSelect={setSelectedStream} />
        ) : null}

        {step === 6 ? (
          <ChoiceList title="Career Clarity" subtitle="How clear are you about your direction?" icon="Clarity" options={clarityOptions} selected={selectedClarity} onSelect={setSelectedClarity} />
        ) : null}

        {step === 7 ? (
          <MultiChoice title="Key Strengths" subtitle="What are your core strengths? Pick all that fit." icon="Strengths" options={strengthOptions} selected={selectedStrengths} onToggle={(value) => toggleMulti(value, selectedStrengths, setSelectedStrengths)} />
        ) : null}

        {step === 8 ? (
          <MultiChoice title="Career Priorities" subtitle="What matters most to you in a career?" icon="Priorities" options={priorityOptions} selected={selectedPriorities} onToggle={(value) => toggleMulti(value, selectedPriorities, setSelectedPriorities)} />
        ) : null}

        {step === 9 ? (
          <ChoiceList title="Guidance Preference" subtitle="Would you like expert career guidance?" icon="Guidance" options={guidanceOptions} selected={selectedGuidance} onSelect={setSelectedGuidance} />
        ) : null}

        {step === 10 ? (
          <View style={styles.centered}>
            <Text style={styles.doneIcon}>Done</Text>
            <Text style={styles.title}>
              {userType === 'parent' ? "Great! We've personalized the experience for your child" : `Your profile is ready, ${name || 'Explorer'}!`}
            </Text>
            <Text style={styles.subtitle}>
              {userType === 'parent'
                ? "Your child's career exploration journey is ready. Let's sign you in."
                : "We've personalised your career journey. Let's sign you in to get started."}
            </Text>
          </View>
        ) : null}

        <Pressable disabled={!canProceed()} onPress={next} style={[styles.primaryButton, !canProceed() && styles.primaryButtonDisabled]}>
          <Text style={styles.primaryButtonText}>
            {step === 0 ? 'Continue' : step === 1 ? 'Start Journey' : step === 9 ? 'Finish' : step === 10 ? 'Continue' : 'Next'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StepInput({
  title,
  icon,
  value,
  setValue,
  placeholder,
}: {
  title: string;
  icon: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.stepSection}>
      <Text style={styles.stepIcon}>{icon}</Text>
      <Text style={styles.stepTitle}>{title}</Text>
      <TextInput value={value} onChangeText={setValue} placeholder={placeholder} placeholderTextColor={palette.muted} style={styles.input} />
    </View>
  );
}

function ChoiceGrid({
  title,
  icon,
  options,
  selected,
  onSelect,
}: {
  title: string;
  icon: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.stepSection}>
      <Text style={styles.stepIcon}>{icon}</Text>
      <Text style={styles.stepTitle}>{title}</Text>
      <View style={styles.optionGrid}>
        {options.map((option) => (
          <Chip key={option} label={option} active={selected === option} onPress={() => onSelect(option)} />
        ))}
      </View>
    </View>
  );
}

function ChoiceList({
  title,
  subtitle,
  icon,
  options,
  selected,
  onSelect,
}: {
  title: string;
  subtitle: string;
  icon: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.stepSection}>
      <Text style={styles.stepIcon}>{icon}</Text>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.helperText}>{subtitle}</Text>
      <View style={styles.listColumn}>
        {options.map((option) => (
          <Chip key={option} label={option} active={selected === option} onPress={() => onSelect(option)} />
        ))}
      </View>
    </View>
  );
}

function MultiChoice({
  title,
  subtitle,
  icon,
  options,
  selected,
  onToggle,
}: {
  title: string;
  subtitle: string;
  icon: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <View style={styles.stepSection}>
      <Text style={styles.stepIcon}>{icon}</Text>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.helperText}>{subtitle}</Text>
      <View style={styles.listColumn}>
        {options.map((option) => (
          <Chip key={option} label={option} active={selected.includes(option)} onPress={() => onToggle(option)} />
        ))}
      </View>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  container: { padding: 24, gap: 20, flexGrow: 1 },
  progressRow: { flexDirection: 'row', gap: 6 },
  progressBar: { flex: 1, height: 6, borderRadius: 999, backgroundColor: '#e6e0dc' },
  progressBarActive: { backgroundColor: palette.primary },
  centered: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingVertical: 28 },
  mascotCard: { width: 112, height: 112, borderRadius: 32, backgroundColor: palette.card, alignItems: 'center', justifyContent: 'center' },
  smallMascotCard: { width: 92, height: 92, borderRadius: 28, backgroundColor: palette.card, alignItems: 'center', justifyContent: 'center' },
  mascot: { fontSize: 34, fontWeight: '900', color: palette.primary },
  title: { fontSize: 28, lineHeight: 36, fontWeight: '900', color: palette.text, textAlign: 'center' },
  subtitle: { fontSize: 14, lineHeight: 22, color: palette.muted, textAlign: 'center', maxWidth: 300 },
  choiceColumn: { width: '100%', gap: 16 },
  choiceCard: { flexDirection: 'row', gap: 16, alignItems: 'center', backgroundColor: palette.card, borderRadius: 24, borderWidth: 2, borderColor: palette.border, padding: 18 },
  choiceCardActive: { borderColor: palette.primary, backgroundColor: '#fff1f4' },
  choiceIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#eee8e5', alignItems: 'center', justifyContent: 'center' },
  choiceIconActive: { backgroundColor: palette.primary },
  choiceIconText: { fontSize: 22, fontWeight: '900', color: palette.muted },
  choiceIconTextActive: { color: '#fff' },
  choiceBody: { flex: 1, gap: 2 },
  choiceTitle: { fontSize: 17, fontWeight: '800', color: palette.text },
  choiceSubtitle: { fontSize: 12, color: palette.muted },
  stepSection: { gap: 14, paddingTop: 8 },
  stepIcon: { fontSize: 26, fontWeight: '800', color: palette.primary, textAlign: 'center' },
  stepTitle: { fontSize: 24, lineHeight: 32, fontWeight: '900', color: palette.text, textAlign: 'center' },
  helperText: { fontSize: 13, color: palette.muted, textAlign: 'center' },
  input: { height: 56, borderRadius: 18, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.card, paddingHorizontal: 16, fontSize: 16, color: palette.text },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  listColumn: { gap: 10 },
  chip: { minWidth: '47%', backgroundColor: palette.card, borderRadius: 18, borderWidth: 1, borderColor: palette.border, paddingHorizontal: 16, paddingVertical: 14 },
  chipActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  chipText: { fontSize: 13, fontWeight: '700', color: palette.text, textAlign: 'center' },
  chipTextActive: { color: '#fff' },
  doneIcon: { fontSize: 36, fontWeight: '900', color: palette.primary },
  primaryButton: { marginTop: 'auto', borderRadius: 18, backgroundColor: palette.primary, paddingVertical: 16, alignItems: 'center' },
  primaryButtonDisabled: { opacity: 0.42 },
  primaryButtonText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});

import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-transparent">
      <ScrollView className="flex-1" contentContainerClassName="flex-grow gap-5 px-6 py-6" showsVerticalScrollIndicator={false}>
        {step > 0 && step < totalSteps - 1 ? (
          <View className="flex-row gap-1.5">
            {Array.from({ length: progressCount }).map((_, index) => (
              <View key={index} className={`h-1.5 flex-1 rounded-full ${index < step ? 'bg-brand' : 'bg-[#e6e0dc]'}`} />
            ))}
          </View>
        ) : null}

        {step === 0 ? (
          <View className="flex-grow items-center justify-center gap-4 py-7">
            <BeeMascot size={86} />
            <Text className="text-center text-[28px] font-black leading-9 text-ink">Choose Your Way</Text>
            <Text className="max-w-[300px] text-center text-[14px] leading-[22px] text-muted">Tell us who you are so we can personalize your experience</Text>
            <View className="w-full gap-4">
              <Pressable onPress={() => setUserType('student')} className={`flex-row items-center gap-4 rounded-[24px] border-2 p-[18px] ${userType === 'student' ? 'border-brand bg-[#fff1f4]' : 'border-line bg-card'}`}>
                <View className={`h-14 w-14 items-center justify-center rounded-[18px] ${userType === 'student' ? 'bg-brand' : 'bg-[#eee8e5]'}`}>
                  <Text className={`text-[22px] font-black ${userType === 'student' ? 'text-white' : 'text-muted'}`}>S</Text>
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className="text-[17px] font-extrabold text-ink">I&apos;m a Student</Text>
                  <Text className="text-[12px] text-muted">Explore career paths for myself</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setUserType('parent')} className={`flex-row items-center gap-4 rounded-[24px] border-2 p-[18px] ${userType === 'parent' ? 'border-brand bg-[#fff1f4]' : 'border-line bg-card'}`}>
                <View className={`h-14 w-14 items-center justify-center rounded-[18px] ${userType === 'parent' ? 'bg-brand' : 'bg-[#eee8e5]'}`}>
                  <Text className={`text-[22px] font-black ${userType === 'parent' ? 'text-white' : 'text-muted'}`}>P</Text>
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className="text-[17px] font-extrabold text-ink">I&apos;m a Parent</Text>
                  <Text className="text-[12px] text-muted">Explore careers for my child</Text>
                </View>
              </Pressable>
            </View>
          </View>
        ) : null}

        {step === 1 ? (
          <View className="flex-grow items-center justify-center gap-4 py-7">
            <BeeMascot size={68} />
            <Text className="text-center text-[28px] font-black leading-9 text-ink">{userType === 'parent' ? 'Welcome, Parent!' : "Hi! I'm your Career Guide"}</Text>
            <Text className="max-w-[300px] text-center text-[14px] leading-[22px] text-muted">
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
          <View className="flex-grow items-center justify-center gap-4 py-7">
            <Text className="text-[36px] font-black text-brand">Done</Text>
            <Text className="text-center text-[28px] font-black leading-9 text-ink">
              {userType === 'parent' ? "Great! We've personalized the experience for your child" : `Your profile is ready, ${name || 'Explorer'}!`}
            </Text>
            <Text className="max-w-[300px] text-center text-[14px] leading-[22px] text-muted">
              {userType === 'parent'
                ? "Your child's career exploration journey is ready. Let's sign you in."
                : "We've personalised your career journey. Let's sign you in to get started."}
            </Text>
          </View>
        ) : null}

        <Pressable className="mt-auto items-center rounded-[18px] bg-brand py-4" disabled={!canProceed()} onPress={next} style={({ pressed }) => ({ opacity: !canProceed() || pressed ? 0.42 : 1 })}>
          <Text className="text-[16px] font-extrabold text-white">
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
    <View className="gap-[14px] pt-2">
      <Text className="text-center text-[26px] font-extrabold text-brand">{icon}</Text>
      <Text className="text-center text-[24px] font-black leading-8 text-ink">{title}</Text>
      <TextInput value={value} onChangeText={setValue} placeholder={placeholder} placeholderTextColor={palette.muted} className="h-14 rounded-[18px] border border-line bg-card px-4 text-[16px] text-ink" />
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
    <View className="gap-[14px] pt-2">
      <Text className="text-center text-[26px] font-extrabold text-brand">{icon}</Text>
      <Text className="text-center text-[24px] font-black leading-8 text-ink">{title}</Text>
      <View className="flex-row flex-wrap gap-3">
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
    <View className="gap-[14px] pt-2">
      <Text className="text-center text-[26px] font-extrabold text-brand">{icon}</Text>
      <Text className="text-center text-[24px] font-black leading-8 text-ink">{title}</Text>
      <Text className="text-center text-[13px] text-muted">{subtitle}</Text>
      <View className="gap-2.5">
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
    <View className="gap-[14px] pt-2">
      <Text className="text-center text-[26px] font-extrabold text-brand">{icon}</Text>
      <Text className="text-center text-[24px] font-black leading-8 text-ink">{title}</Text>
      <Text className="text-center text-[13px] text-muted">{subtitle}</Text>
      <View className="gap-2.5">
        {options.map((option) => (
          <Chip key={option} label={option} active={selected.includes(option)} onPress={() => onToggle(option)} />
        ))}
      </View>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className={`min-w-[47%] rounded-[18px] border px-4 py-[14px] ${active ? 'border-brand bg-brand' : 'border-line bg-card'}`}>
      <Text className={`text-center text-[13px] font-bold ${active ? 'text-white' : 'text-ink'}`}>{label}</Text>
    </Pressable>
  );
}

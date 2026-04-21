import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/app-state';
import { BeeMascot } from '../src/bee-mascot';
import { palette } from '../src/careermap-data';
import { AnimatedBackground } from '../src/animated-background';
import { AnimatedPressable } from '../src/careermap-ui';
const studentClassOptions = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Graduate', 'Post Graduate', 'Working Professional', 'Other'];
const streamOptions = ['Science', 'Commerce', 'Arts', 'Other'];
const interestOptions = ['Science & Tech', 'Problem Solving','Research & Discovery','Art & Literature','Business ','Sports','Creativity & Design','Dance & Music','Helping People','Public Speaking' ];
const clarityOptions = [
    'Clear on my goal, need the right path',
    'Choosing between a few options',
    "Confused between my choice and parents' expectations",
    'I keep changing my options',
    'I have limited awareness of options',
    'I have no idea what to do',
];
const strengthOptions = ['Analytical Thinking', 'Communication', 'Creativity', 'Leadership', 'Problem-solving','Teamwork','Time Management','Adaptability','Critical Thinking','Emotional Intelligence','Technical Skills','Decision Making'];
const priorityOptions = ['High Earning Potential ', 'Passion and Interest', 'Work-Life Balance', 'Job Security', 'Making a Positive Impact', 'Creative Freedom','Intellectual Growth & Advancement'];
export default function OnboardingScreen() {
    const { saveOnboarding } = useAppState();
    const [userType, setUserType] = useState('');
    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [childName, setChildName] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStream, setSelectedStream] = useState('');
    const [otherClass, setOtherClass] = useState('');
    const [otherStream, setOtherStream] = useState('');
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [selectedClarity, setSelectedClarity] = useState('');
    const [selectedStrengths, setSelectedStrengths] = useState([]);
    const [selectedPriorities, setSelectedPriorities] = useState([]);
    const [isOnboardingSaved, setIsOnboardingSaved] = useState(false);
    const stepOpacity = useRef(new Animated.Value(0)).current;
    const stepTranslate = useRef(new Animated.Value(34)).current;
    const totalSteps = 10;
    const progressCount = totalSteps - 2;
    useEffect(() => {
        stepOpacity.setValue(0);
        stepTranslate.setValue(34);
        Animated.parallel([
            Animated.timing(stepOpacity, {
                toValue: 1,
                duration: 320,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(stepTranslate, {
                toValue: 0,
                duration: 320,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, [step, stepOpacity, stepTranslate]);
    const toggleMulti = (value, selected, setSelected) => {
        setSelected(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
    };
    const canProceed = () => {
        if (step === 0)
            return userType !== '';
        if (step === 2)
            return name.trim().length > 0;
        if (step === 3)
            return userType === 'parent' ? childName.trim().length > 0 : selectedClass !== '' && (selectedClass !== 'Other' || otherClass.trim().length > 0);
        if (step === 4)
            return userType === 'parent'
                ? selectedClass !== '' && (selectedClass !== 'Other' || otherClass.trim().length > 0)
                : selectedStream !== '' && (selectedStream !== 'Other' || otherStream.trim().length > 0);
        if (step === 5)
            return userType === 'parent'
                ? selectedStream !== '' && (selectedStream !== 'Other' || otherStream.trim().length > 0)
                : selectedInterests.length > 0;
        if (step === 6)
            return selectedClarity !== '';
        if (step === 7)
            return selectedStrengths.length > 0;
        if (step === 8)
            return selectedPriorities.length > 0;
        return true;
    };
    const next = () => {
        if (step === 8 && !isOnboardingSaved) {
            saveOnboarding({
                userType,
                name,
                childName,
                selectedClass: selectedClass === 'Other' ? otherClass.trim() : selectedClass,
                selectedStream: selectedStream === 'Other' ? otherStream.trim() : selectedStream,
                selectedInterests,
                selectedClarity,
                selectedStrengths,
                selectedPriorities,
                selectedGuidance: '',
            });
            setIsOnboardingSaved(true);
            setStep(step + 1);
            return;
        }
        if (step < totalSteps - 1) {
            setStep(step + 1);
            return;
        }
        router.replace('/login');
    };
    return (<SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}> 
         <AnimatedBackground /> 
          <ScrollView className="flex-1" contentContainerClassName="flex-grow gap-5 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Pressable className="h-10 w-10 items-center justify-center rounded-[14px] bg-surface" onPress={() => {
            if (step > 0) {
                setStep((value) => value - 1);
                return;
            }
            router.back();
        }}>
          <Ionicons name="arrow-back" size={18} color={palette.text}/>
        </Pressable>
        {step > 0 && step < totalSteps - 1 ? (<View className="flex-row gap-1.5">
            {Array.from({ length: progressCount }).map((_, index) => (<View key={index} className={`h-1.5 flex-1 rounded-full ${index < step ? 'bg-brand' : 'bg-[#e6e0dc]'}`}/>))}
          </View>) : null}

        <Animated.View style={{ opacity: stepOpacity, transform: [{ translateX: stepTranslate }] }}>
        {step === 0 ? (<View className="flex-grow items-center justify-center gap-4 py-7">
            <BeeMascot size={100}/>
            <Text className="text-center text-[28px] font-black leading-9 text-ink">Choose Your Roadmap</Text>
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
          </View>) : null}

        {step === 1 ? (<View className="flex-grow items-center justify-center gap-4 py-7">
            <BeeMascot size={100}/>
            <Text className="text-center text-[28px] font-black leading-9 text-ink">{userType === 'parent' ? 'Welcome, Parent!' : "Hi! I'm your Career Guide"}</Text>
            <Text className="max-w-[300px] text-center text-[14px] leading-[22px] text-muted">
              {userType === 'parent'
                ? "We'll help you explore career options for your child's future."
                : "I'll help you explore the best career path. Let's get started."}
            </Text>
          </View>) : null}

        {step === 2 ? (<StepInput title="What's your name?" icon="Name" value={name} setValue={setName} placeholder={userType === 'parent' ? 'Enter your name' : 'Enter your full name'}/>) : null}

        {step === 3 && userType === 'student' ? (<ChoiceGrid title="Which class are you in?" icon="Class" options={studentClassOptions} selected={selectedClass} onSelect={(value) => {
                setSelectedClass(value);
                if (value !== 'Other')
                    setOtherClass('');
            }} otherValue={otherClass} setOtherValue={setOtherClass}/>) : null}

        {step === 3 && userType === 'parent' ? (<StepInput title="What's your child's name?" icon="Child" value={childName} setValue={setChildName} placeholder="Enter your child's name"/>) : null}

        {step === 4 ? (<ChoiceGrid title={userType === 'parent' ? 'Which class is your child in?' : 'Which Stream Excites you the most?'} icon={userType === 'parent' ? 'Class' : 'Stream'} options={userType === 'parent' ? studentClassOptions : streamOptions} selected={userType === 'parent' ? selectedClass : selectedStream} onSelect={(value) => {
                if (userType === 'parent') {
                    setSelectedClass(value);
                    if (value !== 'Other')
                        setOtherClass('');
                    return;
                }
                setSelectedStream(value);
                if (value !== 'Other')
                    setOtherStream('');
            }} otherValue={userType === 'parent' ? otherClass : otherStream} setOtherValue={userType === 'parent' ? setOtherClass : setOtherStream}/>) : null}

        {step === 5 && userType === 'student' ? (<MultiChoice title="What are your interests?" subtitle="Select all that apply" icon="Interests" options={interestOptions} selected={selectedInterests} onToggle={(value) => toggleMulti(value, selectedInterests, setSelectedInterests)}/>) : null}

        {step === 5 && userType === 'parent' ? (<ChoiceGrid title="Which stream interests your child?" icon="Stream" options={streamOptions} selected={selectedStream} onSelect={(value) => {
                setSelectedStream(value);
                if (value !== 'Other')
                    setOtherStream('');
            }} otherValue={otherStream} setOtherValue={setOtherStream}/>) : null}

        {step === 6 ? (<ChoiceList title="Career Clarity" subtitle="How clear are you about your direction?" icon="Clarity" options={clarityOptions} selected={selectedClarity} onSelect={setSelectedClarity}/>) : null}

        {step === 7 ? (<MultiChoice title="Key Strengths" subtitle="What are your core strengths? Pick all that fit." icon="Strengths" options={strengthOptions} selected={selectedStrengths} onToggle={(value) => toggleMulti(value, selectedStrengths, setSelectedStrengths)}/>) : null}

        {step === 8 ? (<MultiChoice title="Career Priorities" subtitle="What matters most to you in a career?" icon="Priorities" options={priorityOptions} selected={selectedPriorities} onToggle={(value) => toggleMulti(value, selectedPriorities, setSelectedPriorities)}/>) : null}

        {step === 9 ? (<SuccessStep/>) : null}

        </Animated.View>

        <AnimatedPressable className="mt-auto items-center rounded-[18px] bg-brand py-4" disabled={!canProceed()} onPress={next}>
          <Text className="text-[16px] font-extrabold text-white">
            {step === 0 ? 'Continue' : step === 1 ? 'Start Journey' : step === 8 ? 'Finish' : step === 9 ? 'Continue' : 'Next'}
          </Text>
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>);
}
function StepInput({ title, icon, value, setValue, placeholder, }) {
    return (<View className="gap-[14px] pt-2">
      <Text className="text-center text-[26px] font-extrabold text-brand">{icon}</Text>
      <Text className="text-center text-[24px] font-black leading-8 text-ink">{title}</Text>
      <TextInput value={value} onChangeText={setValue} placeholder={placeholder} placeholderTextColor={palette.muted} className="h-14 rounded-[18px] border border-line bg-card px-4 text-[16px] text-ink"/>
    </View>);
}
function ChoiceGrid({ title, icon, options, selected, onSelect, otherValue, setOtherValue, }) {
    return (<View className="gap-[14px] pt-2">
      <Text className="text-center text-[26px] font-extrabold text-brand">{icon}</Text>
      <Text className="text-center text-[24px] font-black leading-8 text-ink">{title}</Text>
      <ChoiceRows options={options} renderOption={(option) => <Chip key={option} label={option} active={selected === option} onPress={() => onSelect(option)}/>}/>
      {selected === 'Other' ? (<TextInput value={otherValue} onChangeText={setOtherValue} placeholder="Please write here" placeholderTextColor={palette.muted} className="h-14 rounded-[18px] border border-line bg-card px-4 text-[16px] text-ink"/>) : null}
    </View>);
}
function ChoiceList({ title, subtitle, icon, options, selected, onSelect, }) {
    return (<View className="gap-[14px] pt-2">
      <Text className="text-center text-[26px] font-extrabold text-brand">{icon}</Text>
      <Text className="text-center text-[24px] font-black leading-8 text-ink">{title}</Text>
      <Text className="text-center text-[13px] text-muted">{subtitle}</Text>
      <ChoiceRows options={options} renderOption={(option) => <Chip key={option} label={option} active={selected === option} onPress={() => onSelect(option)}/>}/>
    </View>);
}
function MultiChoice({ title, subtitle, icon, options, selected, onToggle, }) {
    return (<View className="gap-[14px] pt-2">
      <Text className="text-center text-[26px] font-extrabold text-brand">{icon}</Text>
      <Text className="text-center text-[24px] font-black leading-8 text-ink">{title}</Text>
      <Text className="text-center text-[13px] text-muted">{subtitle}</Text>
      <ChoiceRows options={options} renderOption={(option) => <Chip key={option} label={option} active={selected.includes(option)} onPress={() => onToggle(option)}/>}/>
    </View>);
}
function ChoiceRows({ options, renderOption }) {
    const rows = chunkOptions(options);
    return (<View className="gap-3">
      {rows.map((row, index) => (<View key={`row-${index}`} className="flex-row gap-3">
          <View className="flex-1">{renderOption(row[0])}</View>
          <View className="flex-1">{row[1] ? renderOption(row[1]) : <View className="min-h-[64px]"/>}</View>
        </View>))}
    </View>);
}
function Chip({ label, active, onPress }) {
    return (<AnimatedPressable onPress={onPress} className={`min-h-[64px] w-full items-center justify-center rounded-[18px] border px-3 py-[14px] ${active ? 'border-brand bg-brand' : 'border-line bg-card'}`} gradient={active}>
      <Text className={`text-center text-[13px] font-bold leading-[18px] ${active ? 'text-white' : 'text-ink'}`}>{label}</Text>
    </AnimatedPressable>);
}
function SuccessStep() {
    return (<View className="flex-grow items-center justify-center gap-5 py-5">
      <CelebrationBurst/>
      <View className="items-center gap-3">
        <Text className="text-center text-[28px] font-black leading-9 text-ink">Great! We&apos;ve personalized your experience</Text>
        <Text className="max-w-[310px] text-center text-[15px] leading-6 text-muted">
          Your career journey is ready. Let&apos;s sign you in to get started!
        </Text>
      </View>
    </View>);
}
function CelebrationBurst() {
    const burst = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        burst.setValue(0);
        Animated.loop(Animated.sequence([
            Animated.timing(burst, {
                toValue: 1,
                duration: 1500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(burst, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            }),
        ])).start();
    }, [burst]);
    const pieces = [
        { color: '#ff6b6b', x: -86, y: -72, rotate: '-20deg', delay: 0 },
        { color: '#ffd166', x: -58, y: -104, rotate: '18deg', delay: 0.08 },
        { color: '#06d6a0', x: 0, y: -118, rotate: '-10deg', delay: 0.15 },
        { color: '#118ab2', x: 58, y: -104, rotate: '22deg', delay: 0.23 },
        { color: '#f78c6b', x: 86, y: -72, rotate: '-16deg', delay: 0.3 },
        { color: '#ef476f', x: -104, y: -16, rotate: '28deg', delay: 0.18 },
        { color: '#8338ec', x: 102, y: -18, rotate: '-26deg', delay: 0.12 },
    ];
    return (<View className="items-center justify-center pb-6 pt-12">
      <View className="relative h-[220px] w-[220px] items-center justify-center">
        {pieces.map((piece, index) => {
            const translateY = burst.interpolate({
                inputRange: [0, 1],
                outputRange: [0, piece.y],
            });
            const translateX = burst.interpolate({
                inputRange: [0, 1],
                outputRange: [0, piece.x],
            });
            const scale = burst.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [0.4, 1, 0.92],
            });
            const opacity = burst.interpolate({
                inputRange: [0, piece.delay, 1],
                outputRange: [0, 1, 0],
            });
            return (<Animated.View key={`${piece.color}-${index}`} style={{
                    opacity,
                    transform: [{ translateX }, { translateY }, { scale }, { rotate: piece.rotate }],
                }} className="absolute left-1/2 top-1/2 h-4 w-2 rounded-full" >
                <View style={{ backgroundColor: piece.color }} className="h-4 w-2 rounded-full"/>
              </Animated.View>);
        })}
        <BeeMascot size={112}/>
      </View>
    </View>);
}
function chunkOptions(options) {
    const rows = [];
    for (let index = 0; index < options.length; index += 2) {
        rows.push(options.slice(index, index + 2));
    }
    return rows;
}

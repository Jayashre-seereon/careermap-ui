import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from '../../../src/app-state';
import { Screen, UnlockBottomSheet } from '../../../src/careermap-ui';
import { palette } from '../../../src/careermap-data';
import { StaggerFadeUpItem } from '../../../src/page-transition';
import { openSubscriptionPrompt } from '../../../src/subscription-flow';
const streams = [
    { name: 'Science', emoji: '🔬', desc: 'Medical, Engineering & Research' },
    { name: 'Commerce', emoji: '📊', desc: 'Business, Finance & Accounting' },
    { name: 'Arts & Humanities', emoji: '🎨', desc: 'Design, Media & Social Work' },
    { name: 'Vocational', emoji: '🔧', desc: 'Hospitality, Fashion & More' },
    { name: 'Neutral', emoji: '⚡', desc: 'Law, Education & Defence' },
];
const categories = {
    Science: [
        { name: 'Medical', emoji: '🏥' },
        { name: 'Engineering', emoji: '⚙️' },
        { name: 'Pure Sciences', emoji: '🔬' },
        { name: 'Agriculture & Allied', emoji: '🌾' },
    ],
    Commerce: [
        { name: 'Business Management', emoji: '💼' },
        { name: 'Finance & Banking', emoji: '💰' },
        { name: 'Accounting & Taxation', emoji: '📋' },
        { name: 'Marketing & Advertising', emoji: '📢' },
    ],
    'Arts & Humanities': [
        { name: 'Design & Fine Arts', emoji: '🎨' },
        { name: 'Media & Journalism', emoji: '📺' },
        { name: 'Literature & Languages', emoji: '📖' },
        { name: 'Social Sciences', emoji: '🤝' },
    ],
    Vocational: [
        { name: 'Hospitality & Tourism', emoji: '🏨' },
        { name: 'Fashion & Textile', emoji: '👗' },
        { name: 'Agriculture & Dairy', emoji: '🌾' },
        { name: 'Automotive & Mechanical', emoji: '🚗' },
    ],
    Neutral: [
        { name: 'Law & Legal Studies', emoji: '⚖️' },
        { name: 'Education & Teaching', emoji: '📚' },
        { name: 'Defence & Security', emoji: '🎖️' },
        { name: 'Sports & Fitness', emoji: '⚽' },
    ],
};
const programs = {
    Medical: [
        { name: 'MBBS', emoji: '🩺' },
        { name: 'BDS (Dentistry)', emoji: '🦷' },
        { name: 'BAMS (Ayurveda)', emoji: '🌿' },
        { name: 'B.Pharm (Pharmacy)', emoji: '💊' },
        { name: 'B.Sc Nursing', emoji: '🏥' },
        { name: 'BPT (Physiotherapy)', emoji: '🦴' },
    ],
    Engineering: [
        { name: 'B.Tech / B.E.', emoji: '⚙️' },
        { name: 'M.Tech', emoji: '🎓' },
        { name: 'Diploma Engineering', emoji: '📐' },
        { name: 'B.Arch (Architecture)', emoji: '🏛️' },
    ],
    'Pure Sciences': [
        { name: 'B.Sc Physics', emoji: '⚛️' },
        { name: 'B.Sc Chemistry', emoji: '🧪' },
        { name: 'B.Sc Mathematics', emoji: '📐' },
        { name: 'B.Sc Biology', emoji: '🧬' },
        { name: 'M.Sc Programs', emoji: '🎓' },
    ],
    'Agriculture & Allied': [
        { name: 'B.Sc Agriculture', emoji: '🌱' },
        { name: 'B.V.Sc (Veterinary)', emoji: '🐾' },
        { name: 'B.F.Sc (Fisheries)', emoji: '🐟' },
        { name: 'B.Sc Forestry', emoji: '🌲' },
    ],
    'Business Management': [
        { name: 'BBA', emoji: '💼' },
        { name: 'MBA', emoji: '🎓' },
        { name: 'BMS', emoji: '📊' },
        { name: 'Entrepreneurship', emoji: '🚀' },
    ],
    'Finance & Banking': [
        { name: 'B.Com (Hons)', emoji: '📋' },
        { name: 'CA (Chartered Accountant)', emoji: '📈' },
        { name: 'CFA', emoji: '💹' },
        { name: 'Banking & Insurance', emoji: '🏦' },
    ],
    'Accounting & Taxation': [
        { name: 'B.Com', emoji: '📋' },
        { name: 'CA Foundation', emoji: '📈' },
        { name: 'CS (Company Secretary)', emoji: '📜' },
        { name: 'CMA', emoji: '📊' },
    ],
    'Marketing & Advertising': [
        { name: 'BBA Marketing', emoji: '📢' },
        { name: 'B.Com Advertising', emoji: '🎯' },
        { name: 'Digital Marketing', emoji: '💻' },
        { name: 'MBA Marketing', emoji: '🎓' },
    ],
    'Design & Fine Arts': [
        { name: 'B.Des', emoji: '🎨' },
        { name: 'B.F.A', emoji: '🖌️' },
        { name: 'M.Des', emoji: '🎓' },
        { name: 'Animation & VFX', emoji: '🎬' },
    ],
    'Media & Journalism': [
        { name: 'B.A Journalism', emoji: '📰' },
        { name: 'BJMC', emoji: '🎙️' },
        { name: 'Film Making', emoji: '🎥' },
        { name: 'Mass Communication', emoji: '📺' },
    ],
    'Literature & Languages': [
        { name: 'B.A English', emoji: '📖' },
        { name: 'B.A Hindi', emoji: '📝' },
        { name: 'Foreign Languages', emoji: '🌍' },
        { name: 'M.A Literature', emoji: '🎓' },
    ],
    'Social Sciences': [
        { name: 'B.A Psychology', emoji: '🧠' },
        { name: 'B.A Sociology', emoji: '👥' },
        { name: 'B.A Political Science', emoji: '🏛️' },
        { name: 'B.S.W (Social Work)', emoji: '🤝' },
    ],
    'Hospitality & Tourism': [
        { name: 'BHM (Hotel Mgmt)', emoji: '🏨' },
        { name: 'B.Sc Hospitality', emoji: '🍽️' },
        { name: 'Tourism Management', emoji: '✈️' },
        { name: 'Culinary Arts', emoji: '👨‍🍳' },
    ],
    'Fashion & Textile': [
        { name: 'B.Des Fashion', emoji: '👗' },
        { name: 'Textile Design', emoji: '🧵' },
        { name: 'Fashion Technology', emoji: '✂️' },
        { name: 'Apparel Management', emoji: '👔' },
    ],
    'Agriculture & Dairy': [
        { name: 'Dairy Technology', emoji: '🥛' },
        { name: 'Food Technology', emoji: '🍕' },
        { name: 'Horticulture', emoji: '🌺' },
        { name: 'Sericulture', emoji: '🦋' },
    ],
    'Automotive & Mechanical': [
        { name: 'Auto Engineering', emoji: '🚗' },
        { name: 'Mechanical Diploma', emoji: '🔧' },
        { name: 'ITI Courses', emoji: '🛠️' },
        { name: 'EV Technology', emoji: '⚡' },
    ],
    'Law & Legal Studies': [
        { name: 'BA LLB (5 Year)', emoji: '⚖️' },
        { name: 'LLB (3 Year)', emoji: '📜' },
        { name: 'LLM', emoji: '🎓' },
        { name: 'Corporate Law', emoji: '🏢' },
    ],
    'Education & Teaching': [
        { name: 'B.Ed', emoji: '📚' },
        { name: 'D.El.Ed', emoji: '✏️' },
        { name: 'M.Ed', emoji: '🎓' },
        { name: 'Special Education', emoji: '🌟' },
    ],
    'Defence & Security': [
        { name: 'NDA', emoji: '🎖️' },
        { name: 'CDS', emoji: '⭐' },
        { name: 'Indian Navy', emoji: '⚓' },
        { name: 'Air Force', emoji: '✈️' },
    ],
    'Sports & Fitness': [
        { name: 'B.P.Ed', emoji: '🏃' },
        { name: 'Sports Management', emoji: '🏆' },
        { name: 'Sports Science', emoji: '🧬' },
        { name: 'Yoga & Naturopathy', emoji: '🧘' },
    ],
};
const specializations = {
    MBBS: [
        { name: 'General Medicine', emoji: '🩺' },
        { name: 'Surgery', emoji: '🔪' },
    ],
    'BDS (Dentistry)': [
        { name: 'Orthodontics', emoji: '🦷' },
        { name: 'Oral Surgery', emoji: '🔪' },
    ],
    'BAMS (Ayurveda)': [
        { name: 'Panchakarma', emoji: '🌿' },
        { name: 'Kayachikitsa', emoji: '🍃' },
    ],
    'B.Pharm (Pharmacy)': [
        { name: 'Clinical Pharmacy', emoji: '💊' },
        { name: 'Pharmaceutical Research', emoji: '🧪' },
    ],
    'B.Sc Nursing': [
        { name: 'Critical Care', emoji: '🏥' },
        { name: 'Community Health', emoji: '🤝' },
    ],
    'BPT (Physiotherapy)': [
        { name: 'Orthopedic', emoji: '🦴' },
        { name: 'Neurological', emoji: '🧠' },
    ],
};
const careerDetails = {
    'General Medicine': {
        title: 'General Medicine (MD)',
        overview: 'General Medicine involves the diagnosis, treatment, and prevention of adult diseases. Physicians in this specialization manage a wide range of health conditions and often serve as the first point of specialist care for patients.',
        path: ['10+2 (PCB)', 'MBBS (5.5 years)', 'Internship (1 year)', 'MD General Medicine (3 years)', 'Senior Resident', 'Consultant / Professor'],
        education: 'MBBS followed by MD in General Medicine',
        exams: ['NEET UG', 'NEET PG', 'AIIMS', 'JIPMER'],
        jobs: ['General Physician', 'Consultant', 'Hospital Medical Officer', 'Academic Professor', 'ICU Specialist'],
        salary: '₹8-25 LPA',
        institutes: ['AIIMS Delhi', 'CMC Vellore', 'JIPMER', 'Maulana Azad Medical College', 'KEM Mumbai'],
    },
    'Surgery': {
        title: 'General Surgery (MS)',
        overview: 'General Surgery focuses on operative treatment for trauma, abdominal conditions, oncologic cases, and emergency surgical care. Surgeons combine diagnosis, procedural skill, and post-operative management.',
        path: ['10+2 (PCB)', 'MBBS (5.5 years)', 'Internship', 'MS General Surgery (3 years)', 'MCh Specialization', 'Senior Surgeon'],
        education: 'MBBS + MS in General Surgery, with MCh for super-specialization',
        exams: ['NEET UG', 'NEET PG', 'NEET SS'],
        jobs: ['General Surgeon', 'Laparoscopic Surgeon', 'Trauma Surgeon', 'Surgical Oncologist'],
        salary: '₹10-30 LPA',
        institutes: ['AIIMS Delhi', 'PGIMER Chandigarh', 'SGPGI Lucknow'],
    },
    'Orthodontics': {
        title: 'Orthodontics',
        overview: 'Orthodontists specialize in correcting teeth alignment and bite using braces and aligners.',
        path: ['10+2 (PCB)', 'BDS (4 years)', 'MDS Orthodontics (3 years)', 'Orthodontist'],
        education: 'BDS + MDS Orthodontics',
        exams: ['NEET UG', 'NEET MDS'],
        jobs: ['Orthodontist', 'Dental Specialist', 'Private Practice'],
        salary: '₹6-20 LPA',
        institutes: ['Government Dental College', 'Private Dental Colleges'],
    },
    'Oral Surgery': {
        title: 'Oral Surgery',
        overview: 'Oral surgeons perform surgical procedures in the mouth, jaw, and face.',
        path: ['10+2 (PCB)', 'BDS (4 years)', 'MDS Oral Surgery (3 years)', 'Oral Surgeon'],
        education: 'BDS + MDS Oral Surgery',
        exams: ['NEET UG', 'NEET MDS'],
        jobs: ['Oral Surgeon', 'Maxillofacial Surgeon'],
        salary: '₹7-22 LPA',
        institutes: ['Government Dental College', 'Private Dental Colleges'],
    },
    'Panchakarma': {
        title: 'Panchakarma',
        overview: 'Panchakarma specialists provide traditional Ayurvedic cleansing and therapeutic treatments.',
        path: ['10+2 (PCB)', 'BAMS (5.5 years)', 'MD Panchakarma (3 years)', 'Panchakarma Therapist'],
        education: 'BAMS + MD Panchakarma',
        exams: ['NEET UG', 'AIAPGET'],
        jobs: ['Panchakarma Specialist', 'Ayurvedic Therapist'],
        salary: '₹4-12 LPA',
        institutes: ['Banaras Hindu University', 'Gujarat Ayurved University'],
    },
    'Kayachikitsa': {
        title: 'Kayachikitsa',
        overview: 'Kayachikitsa (Internal Medicine in Ayurveda) focuses on treating various diseases through Ayurvedic medicine.',
        path: ['10+2 (PCB)', 'BAMS (5.5 years)', 'MD Kayachikitsa (3 years)', 'Ayurvedic Physician'],
        education: 'BAMS + MD Kayachikitsa',
        exams: ['NEET UG', 'AIAPGET'],
        jobs: ['Ayurvedic Physician', 'Internal Medicine Specialist'],
        salary: '₹4-10 LPA',
        institutes: ['Banaras Hindu University', 'Gujarat Ayurved University'],
    },
    'Clinical Pharmacy': {
        title: 'Clinical Pharmacy',
        overview: 'Clinical pharmacists work directly with patients and healthcare teams to optimize medication therapy.',
        path: ['10+2 (PCB)', 'B.Pharm (4 years)', 'M.Pharm Clinical Pharmacy (2 years)', 'Clinical Pharmacist'],
        education: 'B.Pharm + M.Pharm in Clinical Pharmacy',
        exams: ['GPAT', 'University Exams'],
        jobs: ['Clinical Pharmacist', 'Hospital Pharmacist'],
        salary: '₹5-15 LPA',
        institutes: ['NIPER Hyderabad', 'Manipal College of Pharmacy'],
    },
    'Pharmaceutical Research': {
        title: 'Pharmaceutical Research',
        overview: 'Pharmaceutical researchers develop new drugs and conduct clinical trials.',
        path: ['10+2 (PCB)', 'B.Pharm (4 years)', 'M.Pharm/PhD (2-5 years)', 'Research Scientist'],
        education: 'B.Pharm + M.Pharm/PhD',
        exams: ['GPAT', 'CSIR NET', 'UGC NET'],
        jobs: ['Research Scientist', 'Drug Developer', 'Clinical Researcher'],
        salary: '₹6-20 LPA',
        institutes: ['NIPER Hyderabad', 'BITS Pilani'],
    },
    'Critical Care': {
        title: 'Critical Care Nursing',
        overview: 'Critical care nurses provide intensive care to critically ill patients in ICUs.',
        path: ['10+2 (PCB)', 'B.Sc Nursing (4 years)', 'Specialization (1-2 years)', 'Critical Care Nurse'],
        education: 'B.Sc Nursing + Specialization',
        exams: ['AIIMS Nursing', 'JIPMER Nursing'],
        jobs: ['ICU Nurse', 'Critical Care Specialist'],
        salary: '₹4-10 LPA',
        institutes: ['AIIMS Delhi', 'CMC Vellore'],
    },
    'Community Health': {
        title: 'Community Health Nursing',
        overview: 'Community health nurses provide healthcare services to communities and populations.',
        path: ['10+2 (PCB)', 'B.Sc Nursing (4 years)', 'Community Medicine Focus', 'Community Health Nurse'],
        education: 'B.Sc Nursing',
        exams: ['AIIMS Nursing', 'JIPMER Nursing'],
        jobs: ['Community Health Nurse', 'Public Health Nurse'],
        salary: '₹3-8 LPA',
        institutes: ['AIIMS Delhi', 'CMC Vellore'],
    },
    'Orthopedic': {
        title: 'Orthopedic Physiotherapy',
        overview: 'Orthopedic physiotherapists treat musculoskeletal injuries and conditions.',
        path: ['10+2 (PCB)', 'BPT (4.5 years)', 'MPT Orthopedic (2 years)', 'Orthopedic Physiotherapist'],
        education: 'BPT + MPT Orthopedic',
        exams: ['University Entrance Tests'],
        jobs: ['Orthopedic Physiotherapist', 'Sports Physical Therapist'],
        salary: '₹4-12 LPA',
        institutes: ['Christian Medical College', 'Manipal University'],
    },
    'Neurological': {
        title: 'Neurological Physiotherapy',
        overview: 'Neurological physiotherapists treat conditions affecting the nervous system.',
        path: ['10+2 (PCB)', 'BPT (4.5 years)', 'MPT Neurology (2 years)', 'Neuro Physiotherapist'],
        education: 'BPT + MPT Neurology',
        exams: ['University Entrance Tests'],
        jobs: ['Neurological Physiotherapist', 'Neuro Rehabilitation Specialist'],
        salary: '₹4-12 LPA',
        institutes: ['Christian Medical College', 'Manipal University'],
    },
};
const defaultDetail = (name) => ({
    title: name,
    overview: `${name} is a specialized field offering excellent career prospects.`,
    path: ['Step 1', 'Step 2', 'Step 3', 'Career Position'],
    education: 'Relevant degrees required',
    exams: ['Relevant Entrance Exams'],
    jobs: ['Career Options'],
    salary: '₹3-20 LPA',
    institutes: ['Leading Institutes'],
});
export default function CareerLibraryScreen() {
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const { canAccessFreeDetail, isUnlocked, registerFreeDetailAccess, savedCareers, toggleSavedCareer } = useAppState();
    const [currentLevel, setCurrentLevel] = useState('streams');
    const [selectedStream, setSelectedStream] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedSpecialization, setSelectedSpecialization] = useState(null);
    const [showUnlockSheet, setShowUnlockSheet] = useState(false);
    const animationKey = `${currentLevel}-${selectedStream ?? 'none'}-${selectedCategory ?? 'none'}-${selectedProgram ?? 'none'}-${selectedSpecialization ?? 'none'}`;
    const detailKey = selectedSpecialization ?? selectedProgram;
    const detailUnlocked = detailKey ? canAccessFreeDetail('career-library', detailKey) : true;
    const returnTarget = useMemo(() => ({
        pathname: '/(drawer)/(tabs)/library',
        params: {
            level: 'details',
            stream: selectedStream,
            category: selectedCategory,
            program: selectedProgram,
            specialization: selectedSpecialization,
        },
    }), [selectedCategory, selectedProgram, selectedSpecialization, selectedStream]);
    useEffect(() => {
        if (typeof params.level === 'string') {
            setCurrentLevel(params.level);
        }
        setSelectedStream(typeof params.stream === 'string' ? params.stream : null);
        setSelectedCategory(typeof params.category === 'string' ? params.category : null);
        setSelectedProgram(typeof params.program === 'string' ? params.program : null);
        setSelectedSpecialization(typeof params.specialization === 'string' ? params.specialization : null);
    }, [params.category, params.level, params.program, params.specialization, params.stream]);
    const handleStreamSelect = (stream) => {
        setSelectedStream(stream);
        setCurrentLevel('categories');
    };
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentLevel('programs');
    };
    const handleProgramSelect = (program) => {
        setSelectedProgram(program);
        setCurrentLevel('specializations');
    };
    const canOpenCareerItem = (itemKey) => isUnlocked('career-library') || canAccessFreeDetail('career-library', itemKey);
    const handleSpecializationSelect = (specialization) => {
        if (!canOpenCareerItem(specialization)) {
            setShowUnlockSheet(true);
            return;
        }
        registerFreeDetailAccess('career-library', specialization);
        setSelectedSpecialization(specialization);
        setCurrentLevel('details');
    };
    const handleBack = () => {
        if (currentLevel === 'details') {
            setSelectedSpecialization(null);
            setCurrentLevel('specializations');
        }
        else if (currentLevel === 'specializations') {
            setSelectedProgram(null);
            setCurrentLevel('programs');
        }
        else if (currentLevel === 'programs') {
            setSelectedCategory(null);
            setCurrentLevel('categories');
        }
        else if (currentLevel === 'categories') {
            setSelectedStream(null);
            setCurrentLevel('streams');
        }
    };
    const renderStreams = () => (<View className="flex-row flex-wrap gap-3">
      {streams.map((stream) => (<Pressable key={stream.name} onPress={() => handleStreamSelect(stream.name)} className="w-[48%] items-center rounded-[16px] border border-line bg-card p-4">
          <Text className="mb-2 text-[32px]">{stream.emoji}</Text>
          <Text className="mb-1 text-center text-[14px] font-bold text-ink">{stream.name}</Text>
          <Text className="text-center text-[11px] text-muted">{stream.desc}</Text>
        </Pressable>))}
    </View>);
    const renderCategories = () => (<View className="flex-row flex-wrap gap-3">
      {categories[selectedStream]?.map((category) => (<Pressable key={category.name} onPress={() => handleCategorySelect(category.name)} className="w-[48%] items-center rounded-[16px] border border-line bg-card p-4">
          <Text className="mb-2 text-[32px]">{category.emoji}</Text>
          <Text className="mb-1 text-center text-[14px] font-bold text-ink">{category.name}</Text>
        </Pressable>))}
    </View>);
    const renderPrograms = () => {
        const programList = programs[selectedCategory] || [];
        return (<View className="gap-3">
        {programList.map((program, index) => {
                const unlockedItem = canOpenCareerItem(program.name);
                return (<StaggerFadeUpItem key={program.name} index={index}>
                  <Pressable onPress={() => {
                        handleProgramSelect(program.name);
                    }} className="flex-row items-center rounded-[12px] border border-line bg-card p-3">
            <View className="flex-1 flex-row items-center">
              <Text className="mr-3 text-[24px]">{program.emoji}</Text>
              <Text className="flex-1 text-[14px] font-semibold text-ink">{program.name}</Text>
            </View>
            {!isUnlocked('career-library') ? (<View className="mr-2 rounded-full px-2 py-1" style={{ backgroundColor: unlockedItem ? `${palette.green}14` : '#f8e8d8' }}>
                <Text className="text-[10px] font-black" style={{ color: unlockedItem ? palette.green : palette.primary }}>{unlockedItem ? 'FREE' : 'LOCK'}</Text>
              </View>) : null}
            <Ionicons name={unlockedItem ? 'chevron-forward' : 'lock-closed'} size={18} color={unlockedItem ? palette.primary : palette.muted}/>
          </Pressable>
          </StaggerFadeUpItem>);
            })}
      </View>);
    };
    const renderSpecializations = () => {
        const specializationList = specializations[selectedProgram] || [];
        if (specializationList.length === 0) {
            const unlockedItem = canOpenCareerItem(selectedProgram);
            return (<Pressable onPress={() => handleSpecializationSelect(selectedProgram)} className="items-center rounded-[16px] border border-line bg-card p-6">
          <Text className="mb-2 text-[18px] font-bold text-ink">{selectedProgram}</Text>
          <Text className="text-[13px] text-muted">{unlockedItem ? 'View general details' : 'Tap to unlock this career'}</Text>
          {!isUnlocked('career-library') ? (<View className="mt-3 rounded-full px-3 py-1.5" style={{ backgroundColor: unlockedItem ? `${palette.green}14` : '#f8e8d8' }}>
              <Text className="text-[10px] font-black" style={{ color: unlockedItem ? palette.green : palette.primary }}>{unlockedItem ? 'FREE ACCESS' : 'LOCKED'}</Text>
            </View>) : null}
        </Pressable>);
        }
        return (<View className="gap-3">
        {specializationList.map((specialization, index) => {
                const unlockedItem = canOpenCareerItem(specialization.name);
                return (<StaggerFadeUpItem key={specialization.name} index={index}>
                  <Pressable onPress={() => {
                        handleSpecializationSelect(specialization.name);
                    }} className="flex-row items-center rounded-[12px] border border-line bg-card p-3">
            <View className="flex-1 flex-row items-center">
              <Text className="mr-3 text-[24px]">{specialization.emoji}</Text>
              <Text className="flex-1 text-[14px] font-semibold text-ink">{specialization.name}</Text>
            </View>
            {!isUnlocked('career-library') ? (<View className="mr-2 rounded-full px-2 py-1" style={{ backgroundColor: unlockedItem ? `${palette.green}14` : '#f8e8d8' }}>
                <Text className="text-[10px] font-black" style={{ color: unlockedItem ? palette.green : palette.primary }}>{unlockedItem ? 'FREE' : 'LOCK'}</Text>
              </View>) : null}
            <Ionicons name={unlockedItem ? 'chevron-forward' : 'lock-closed'} size={18} color={unlockedItem ? palette.primary : palette.muted}/>
          </Pressable>
          </StaggerFadeUpItem>);
            })}
      </View>);
    };
    const renderDetails = () => {
        const detail = careerDetails[selectedSpecialization] || defaultDetail(selectedSpecialization);
        const isSaved = savedCareers.includes(detail.title);
        return (<View className="flex-1">
        <ScrollView className="flex-1" contentContainerClassName="px-4 pb-4" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 160, 190) }} showsVerticalScrollIndicator={false}>
        {!isUnlocked('career-library') ? (<View className="mb-4 flex-row items-center gap-2 rounded-[12px] px-3 py-3" style={{ backgroundColor: `${detailUnlocked ? palette.green : palette.orange}14` }}>
            <Ionicons name={detailUnlocked ? 'sparkles-outline' : 'lock-closed'} size={18} color={detailUnlocked ? palette.green : palette.orange}/>
            <Text className="flex-1 text-[12px] font-semibold" style={{ color: detailUnlocked ? palette.green : palette.orange }}>
              {detailUnlocked ? 'Your first career detail is unlocked for free.' : 'You have already used the free career detail. Subscribe to view more.'}
            </Text>
          </View>) : null}

        <View className="mb-4 items-center rounded-[24px] border border-[#f0e2da] bg-[#fff9f6] px-4 py-6">
          <View className="mb-3 h-[76px] w-[76px] items-center justify-center rounded-[24px] bg-[#ffecef]">
            <Ionicons name="school-outline" size={34} color={palette.primary}/>
          </View>
          <Text className="text-center text-[24px] font-black text-ink">{detail.title}</Text>
          <Text className="mt-2 text-center text-[13px] leading-5 text-muted">{detail.overview}</Text>
        </View>
        <Pressable onPress={() => toggleSavedCareer(detail.title)} className={`mb-4 flex-row items-center justify-center gap-2 rounded-[14px] border px-4 py-3 ${isSaved ? 'border-brand bg-brand' : 'border-line bg-card'}`}>
          <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={18} color={isSaved ? '#fff' : palette.primary}/>
          <Text className={`text-[13px] font-extrabold ${isSaved ? 'text-white' : 'text-brand'}`}>{isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}</Text>
        </Pressable>

        <View className="mb-5 rounded-[20px] border border-line bg-card p-4">
          <Text className="mb-2 text-[14px] font-bold text-ink">Career Path</Text>
          {detail.path.map((step, i) => (<View key={i} className="mb-2.5 flex-row items-start">
              <Text className="mr-3 h-7 w-7 rounded-full bg-brand text-center text-[13px] font-bold leading-7 text-white">{i + 1}</Text>
              <Text className="flex-1 text-[13px] leading-5 text-ink">{step}</Text>
            </View>))}
        </View>

        <View className="mb-5 rounded-[20px] border border-line bg-card p-4">
          <Text className="mb-2 text-[14px] font-bold text-ink">Education</Text>
          <Text className="pt-1 text-[13px] leading-5 text-muted">{detail.education}</Text>
        </View>

        <View className="mb-5 rounded-[20px] border border-line bg-card p-4">
          <Text className="mb-2 text-[14px] font-bold text-ink">Entrance Exams</Text>
          {detail.exams.map(exam => (<View key={exam} className="mb-2 flex-row items-start">
              <View className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-[#b9b2b8]"/>
              <Text className="flex-1 text-[13px] leading-5 text-muted">{exam}</Text>
            </View>))}
        </View>

        <View className="mb-5 rounded-[20px] border border-line bg-card p-4">
          <Text className="mb-2 text-[14px] font-bold text-ink">Job Opportunities</Text>
          {detail.jobs.map(job => (<View key={job} className="mb-2 flex-row items-start">
              <View className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-[#b9b2b8]"/>
              <Text className="flex-1 text-[13px] leading-5 text-muted">{job}</Text>
            </View>))}
        </View>

        <View className="mb-5 rounded-[20px] border border-line bg-card p-4">
          <Text className="mb-2 text-[14px] font-bold text-ink">Salary Range</Text>
          <Text className="text-[16px] font-bold text-brand">{detail.salary}</Text>
        </View>

        <View className="mb-5 rounded-[20px] border border-line bg-card p-4">
          <Text className="mb-2 text-[14px] font-bold text-ink">Top Institutes</Text>
          {detail.institutes.map(institute => (<View key={institute} className="mb-2 flex-row items-start">
              <Ionicons name="star" size={12} color={palette.secondary} style={{ marginRight: 8, marginTop: 3 }}/>
              <Text className="flex-1 text-[13px] leading-5 text-muted">{institute}</Text>
            </View>))}
        </View>
      </ScrollView>
      </View>);
    };
    const getTitle = () => {
        if (currentLevel === 'streams')
            return 'Career Library';
        if (currentLevel === 'categories')
            return selectedStream;
        if (currentLevel === 'programs')
            return selectedCategory;
        if (currentLevel === 'specializations')
            return selectedProgram;
        if (currentLevel === 'details')
            return selectedSpecialization;
        return 'Career Library';
    };
    return (<Screen scroll={false} animationKey={animationKey}>
      <View className="flex-row items-center px-6 py-4">
        {currentLevel !== 'streams' && (<Pressable onPress={handleBack} className="mr-3 h-10 w-10 items-center justify-center rounded-full">
            <Ionicons name="chevron-back" size={24} color={palette.text}/>
          </Pressable>)}
        <Text className="text-[18px] font-extrabold text-ink">{getTitle()}</Text>
      </View>

      {currentLevel === 'details' ? (renderDetails()) : (<ScrollView className="flex-1" contentContainerClassName="gap-3 px-4 pb-4" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 160, 190) }} showsVerticalScrollIndicator={false}>
          {currentLevel === 'streams' && renderStreams()}
          {currentLevel === 'categories' && renderCategories()}
          {currentLevel === 'programs' && renderPrograms()}
          {currentLevel === 'specializations' && renderSpecializations()}
        </ScrollView>)}
      {showUnlockSheet ? (<UnlockBottomSheet title="Unlock Career Library" subtitle="Subscribe to more careers, salary insights, education paths, and institute details." onClose={() => setShowUnlockSheet(false)} onPress={() => {
                setShowUnlockSheet(false);
                openSubscriptionPrompt(returnTarget);
            }}/>) : null}
    </Screen>);
}

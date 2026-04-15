import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useAppState } from '../../../src/app-state';
import { Screen } from '../../../src/careermap-ui';
import { palette } from '../../../src/careermap-data';
const MAX_FREE_ITEMS = 5;
const PREVIEW_SECONDS = 15;
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
    const { isUnlocked, savedCareers, toggleSavedCareer } = useAppState();
    const [currentLevel, setCurrentLevel] = useState('streams');
    const [selectedStream, setSelectedStream] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedSpecialization, setSelectedSpecialization] = useState(null);
    const [contentTimer, setContentTimer] = useState(null);
    const [contentLocked, setContentLocked] = useState(false);
    const locked = !isUnlocked('career-library');
    useEffect(() => {
        if (currentLevel === 'details' && locked && !contentLocked) {
            const timer = setTimeout(() => {
                setContentLocked(true);
            }, PREVIEW_SECONDS * 1000);
            setContentTimer(PREVIEW_SECONDS);
            const interval = setInterval(() => {
                setContentTimer(prev => {
                    if (prev && prev > 1)
                        return prev - 1;
                    return 0;
                });
            }, 1000);
            return () => { clearTimeout(timer); clearInterval(interval); };
        }
    }, [currentLevel, locked, contentLocked]);
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
    const handleSpecializationSelect = (specialization) => {
        setSelectedSpecialization(specialization);
        setCurrentLevel('details');
        setContentLocked(false);
    };
    const handleBack = () => {
        if (currentLevel === 'details') {
            setSelectedSpecialization(null);
            setContentLocked(false);
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
                const itemLocked = locked && index >= MAX_FREE_ITEMS;
                return (<Pressable key={program.name} onPress={() => {
                        if (!itemLocked)
                            handleProgramSelect(program.name);
                    }} className={`flex-row items-center rounded-[12px] border border-line bg-card p-3 ${itemLocked ? 'opacity-55' : ''}`}>
            <View className="flex-1 flex-row items-center">
              <Text className="mr-3 text-[24px]">{program.emoji}</Text>
              <Text className="flex-1 text-[14px] font-semibold text-ink">{program.name}</Text>
            </View>
            <Ionicons name={itemLocked ? 'lock-closed' : 'chevron-forward'} size={18} color={itemLocked ? palette.muted : palette.primary}/>
          </Pressable>);
            })}
        {locked && programList.length > MAX_FREE_ITEMS ? (<View className="items-center rounded-[18px] border border-[#efd5cb] bg-[#fff7f3] px-5 py-5">
            <Ionicons name="lock-closed" size={24} color={palette.primary}/>
            <Text className="mt-2 text-[15px] font-extrabold text-ink">Unlock Full Career Library</Text>
            <Text className="mt-1 text-center text-[12px] leading-5 text-muted">Subscribe to explore all programs and specializations from this branch.</Text>
            <Pressable onPress={() => router.push('/(drawer)/subscription')} className="mt-3 rounded-[12px] bg-brand px-5 py-3">
              <Text className="text-[13px] font-extrabold text-white">View Plans</Text>
            </Pressable>
          </View>) : null}
      </View>);
    };
    const renderSpecializations = () => {
        const specializationList = specializations[selectedProgram] || [];
        if (specializationList.length === 0) {
            return (<Pressable onPress={() => handleSpecializationSelect(selectedProgram)} className="items-center rounded-[16px] border border-line bg-card p-6">
          <Text className="mb-2 text-[18px] font-bold text-ink">{selectedProgram}</Text>
          <Text className="text-[13px] text-muted">View general details</Text>
        </Pressable>);
        }
        return (<View className="gap-3">
        {specializationList.map((specialization, index) => {
                const itemLocked = locked && index >= MAX_FREE_ITEMS;
                return (<Pressable key={specialization.name} onPress={() => {
                        if (!itemLocked)
                            handleSpecializationSelect(specialization.name);
                    }} className={`flex-row items-center rounded-[12px] border border-line bg-card p-3 ${itemLocked ? 'opacity-55' : ''}`}>
            <View className="flex-1 flex-row items-center">
              <Text className="mr-3 text-[24px]">{specialization.emoji}</Text>
              <Text className="flex-1 text-[14px] font-semibold text-ink">{specialization.name}</Text>
            </View>
            <Ionicons name={itemLocked ? 'lock-closed' : 'chevron-forward'} size={18} color={itemLocked ? palette.muted : palette.primary}/>
          </Pressable>);
            })}
        {locked && specializationList.length > MAX_FREE_ITEMS ? (<View className="items-center rounded-[18px] border border-[#efd5cb] bg-[#fff7f3] px-5 py-5">
            <Ionicons name="lock-closed" size={24} color={palette.primary}/>
            <Text className="mt-2 text-[15px] font-extrabold text-ink">Unlock All Specializations</Text>
            <Text className="mt-1 text-center text-[12px] leading-5 text-muted">Subscribe to open the remaining specializations and full career detail pages.</Text>
            <Pressable onPress={() => router.push('/(drawer)/subscription')} className="mt-3 rounded-[12px] bg-brand px-5 py-3">
              <Text className="text-[13px] font-extrabold text-white">View Plans</Text>
            </Pressable>
          </View>) : null}
      </View>);
    };
    const renderDetails = () => {
        const detail = careerDetails[selectedSpecialization] || defaultDetail(selectedSpecialization);
        const isSaved = savedCareers.includes(detail.title);
        if (contentLocked && locked) {
            return (<View className="items-center justify-center gap-4 py-[60px]">
          <Ionicons name="lock-closed" size={48} color={palette.primary}/>
          <Text className="text-[18px] font-bold text-ink">Preview Time Expired</Text>
          <Text className="text-center text-[14px] text-muted">Subscribe to unlock full access to all career details, education paths, and salary insights.</Text>
          <Pressable onPress={() => router.push('/(drawer)/subscription')} className="rounded-[12px] bg-brand px-6 py-3">
            <Text className="text-[14px] font-bold text-white">Unlock Full Access</Text>
          </Pressable>
        </View>);
        }
        return (<ScrollView contentContainerClassName="p-4">
        {locked && !contentLocked && contentTimer !== null && (<View className="mb-4 flex-row items-center gap-2 rounded-[12px] px-3 py-3" style={{ backgroundColor: `${palette.orange}20` }}>
            <Ionicons name="time-outline" size={20} color={palette.orange}/>
            <Text className="text-[13px] font-semibold" style={{ color: palette.orange }}>Free preview: {contentTimer}s remaining</Text>
          </View>)}

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
          <Text className="text-[13px] leading-5 text-muted">{detail.education}</Text>
        </View>

        <View className="mb-5 rounded-[20px] border border-line bg-card p-4">
          <Text className="mb-2 text-[14px] font-bold text-ink">Entrance Exams</Text>
          {detail.exams.map(exam => (<Text key={exam} className="mb-1.5 text-[13px] text-muted">• {exam}</Text>))}
        </View>

        <View className="mb-5 rounded-[20px] border border-line bg-card p-4">
          <Text className="mb-2 text-[14px] font-bold text-ink">Job Opportunities</Text>
          {detail.jobs.map(job => (<Text key={job} className="mb-1.5 text-[13px] text-muted">• {job}</Text>))}
        </View>

        <View className="mb-5 rounded-[20px] border border-line bg-card p-4">
          <Text className="mb-2 text-[14px] font-bold text-ink">Salary Range</Text>
          <Text className="text-[16px] font-bold text-brand">{detail.salary}</Text>
        </View>

        <View className="mb-5 rounded-[20px] border border-line bg-card p-4">
          <Text className="mb-2 text-[14px] font-bold text-ink">Top Institutes</Text>
          {detail.institutes.map(institute => (<Text key={institute} className="mb-1.5 text-[13px] text-muted">★ {institute}</Text>))}
        </View>
      </ScrollView>);
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
    return (<Screen>
      <View className="flex-row items-center px-6 py-4">
        {currentLevel !== 'streams' && (<Pressable onPress={handleBack} className="mr-3 h-10 w-10 items-center justify-center rounded-full">
            <Ionicons name="chevron-back" size={24} color={palette.text}/>
          </Pressable>)}
        <Text className="text-[18px] font-extrabold text-ink">{getTitle()}</Text>
      </View>

      {currentLevel === 'details' ? (renderDetails()) : (<ScrollView contentContainerClassName="gap-3 p-4">
          {currentLevel === 'streams' && renderStreams()}
          {currentLevel === 'categories' && renderCategories()}
          {currentLevel === 'programs' && renderPrograms()}
          {currentLevel === 'specializations' && renderSpecializations()}
        </ScrollView>)}
    </Screen>);
}

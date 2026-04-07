import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppState } from '../../../src/app-state';
import { Screen } from '../../../src/careermap-ui';
import { palette } from '../../../src/careermap-data';

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

const programs: Record<string, { name: string; emoji: string }[]> = {
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

const specializations: Record<string, { name: string; emoji: string }[]> = {
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

const careerDetails: Record<string, {
  title: string;
  overview: string;
  path: string[];
  education: string;
  exams: string[];
  jobs: string[];
  salary: string;
  institutes: string[];
}> = {
  'General Medicine': {
    title: 'General Medicine',
    overview: 'General medicine doctors provide comprehensive medical care, diagnose and treat a wide range of illnesses, and manage patient health.',
    path: ['10+2 (PCB)', 'NEET UG', 'MBBS (5.5 years)', 'MD General Medicine (3 years)', 'General Physician'],
    education: 'MBBS followed by MD in General Medicine',
    exams: ['NEET UG', 'NEET PG'],
    jobs: ['General Physician', 'Hospital Doctor', 'Clinic Doctor', 'Medical Officer'],
    salary: '₹8-25 LPA',
    institutes: ['AIIMS Delhi', 'KEM Mumbai', 'CMC Vellore', 'Christian Medical College'],
  },
  'Surgery': {
    title: 'Surgery',
    overview: 'Surgeons perform surgical procedures, manage surgical emergencies, and provide operative care for patients.',
    path: ['10+2 (PCB)', 'NEET UG', 'MBBS (5.5 years)', 'MS Surgery (3 years)', 'Surgeon'],
    education: 'MBBS followed by MS in Surgery',
    exams: ['NEET UG', 'NEET PG'],
    jobs: ['Surgeon', 'General Surgeon', 'Surgical Consultant', 'Hospital Surgeon'],
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

const defaultDetail = (name: string) => ({
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
  const { isUnlocked } = useAppState();
  const [currentLevel, setCurrentLevel] = useState<'streams' | 'categories' | 'programs' | 'specializations' | 'details'>('streams');
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);
  const [contentTimer, setContentTimer] = useState<number | null>(null);
  const [contentLocked, setContentLocked] = useState(false);

  const locked = !isUnlocked('career-library');

  useEffect(() => {
    if (currentLevel === 'details' && locked && !contentLocked) {
      const timer = setTimeout(() => {
        setContentLocked(true);
      }, 10000);
      setContentTimer(10);
      const interval = setInterval(() => {
        setContentTimer(prev => {
          if (prev && prev > 1) return prev - 1;
          return 0;
        });
      }, 1000);
      return () => { clearTimeout(timer); clearInterval(interval); };
    }
  }, [currentLevel, locked, contentLocked]);

  const handleStreamSelect = (stream: string) => {
    setSelectedStream(stream);
    setCurrentLevel('categories');
    setBreadcrumb([stream]);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentLevel('programs');
    setBreadcrumb([selectedStream!, category]);
  };

  const handleProgramSelect = (program: string) => {
    setSelectedProgram(program);
    setCurrentLevel('specializations');
    setBreadcrumb([selectedStream!, selectedCategory!, program]);
  };

  const handleSpecializationSelect = (specialization: string) => {
    setSelectedSpecialization(specialization);
    setCurrentLevel('details');
    setBreadcrumb([selectedStream!, selectedCategory!, selectedProgram!, specialization]);
    setContentLocked(false);
  };

  const handleBack = () => {
    if (currentLevel === 'details') {
      setSelectedSpecialization(null);
      setBreadcrumb([selectedStream!, selectedCategory!, selectedProgram!]);
      setContentLocked(false);
      setCurrentLevel('specializations');
    } else if (currentLevel === 'specializations') {
      setSelectedProgram(null);
      setBreadcrumb([selectedStream!, selectedCategory!]);
      setCurrentLevel('programs');
    } else if (currentLevel === 'programs') {
      setSelectedCategory(null);
      setBreadcrumb([selectedStream!]);
      setCurrentLevel('categories');
    } else if (currentLevel === 'categories') {
      setSelectedStream(null);
      setBreadcrumb([]);
      setCurrentLevel('streams');
    }
  };

  const renderStreams = () => (
    <View style={styles.grid}>
      {streams.map((stream) => (
        <Pressable key={stream.name} onPress={() => handleStreamSelect(stream.name)} style={styles.card}>
          <Text style={styles.cardEmoji}>{stream.emoji}</Text>
          <Text style={styles.cardTitle}>{stream.name}</Text>
          <Text style={styles.cardDesc}>{stream.desc}</Text>
        </Pressable>
      ))}
    </View>
  );

  const renderCategories = () => (
    <View style={styles.grid}>
      {categories[selectedStream!]?.map((category) => (
        <Pressable key={category.name} onPress={() => handleCategorySelect(category.name)} style={styles.card}>
          <Text style={styles.cardEmoji}>{category.emoji}</Text>
          <Text style={styles.cardTitle}>{category.name}</Text>
        </Pressable>
      ))}
    </View>
  );

  const renderPrograms = () => {
    const programList = programs[selectedCategory!] || [];
    return (
      <View style={styles.list}>
        {programList.map((program) => (
          <Pressable key={program.name} onPress={() => handleProgramSelect(program.name)} style={styles.programCard}>
            <View style={styles.programHeader}>
              <Text style={styles.programEmoji}>{program.emoji}</Text>
              <Text style={styles.programTitle}>{program.name}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderSpecializations = () => {
    const specializationList = specializations[selectedProgram!] || [];
    if (specializationList.length === 0) {
      return (
        <Pressable onPress={() => handleSpecializationSelect(selectedProgram!)} style={styles.fullCard}>
          <Text style={styles.fullCardTitle}>{selectedProgram}</Text>
          <Text style={styles.fullCardText}>Tap to explore details</Text>
        </Pressable>
      );
    }
    return (
      <View style={styles.list}>
        {specializationList.map((specialization) => (
          <Pressable key={specialization.name} onPress={() => handleSpecializationSelect(specialization.name)} style={styles.programCard}>
            <View style={styles.programHeader}>
              <Text style={styles.programEmoji}>{specialization.emoji}</Text>
              <Text style={styles.programTitle}>{specialization.name}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderDetails = () => {
    const detail = careerDetails[selectedSpecialization!] || defaultDetail(selectedSpecialization!);

    if (contentLocked && locked) {
      return (
        <View style={styles.lockedContent}>
          <Ionicons name="lock-closed" size={48} color={palette.primary} />
          <Text style={styles.lockedContentTitle}>Preview Time Expired</Text>
          <Text style={styles.lockedContentText}>Subscribe to unlock full access to all career details.</Text>
          <Pressable onPress={() => router.push('/(drawer)/subscription')} style={styles.unlockButton}>
            <Text style={styles.unlockButtonText}>Unlock Full Access</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        {locked && !contentLocked && contentTimer !== null && (
          <View style={styles.timerBanner}>
            <Ionicons name="time-outline" size={20} color={palette.orange} />
            <Text style={styles.timerText}>Free preview: {contentTimer}s remaining</Text>
          </View>
        )}

        <Text style={styles.detailTitle}>{detail.title}</Text>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.sectionContent}>{detail.overview}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Career Path</Text>
          {detail.path.map((step, i) => (
            <View key={i} style={styles.pathStep}>
              <Text style={styles.stepNumber}>{i + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Education</Text>
          <Text style={styles.sectionContent}>{detail.education}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Entrance Exams</Text>
          {detail.exams.map(exam => (
            <Text key={exam} style={styles.examText}>• {exam}</Text>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Job Opportunities</Text>
          {detail.jobs.map(job => (
            <Text key={job} style={styles.jobText}>• {job}</Text>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Salary Range</Text>
          <Text style={styles.salaryText}>{detail.salary}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Top Institutes</Text>
          {detail.institutes.map(institute => (
            <Text key={institute} style={styles.instituteText}>★ {institute}</Text>
          ))}
        </View>
      </ScrollView>
    );
  };

  const getTitle = () => {
    if (currentLevel === 'streams') return 'Career Library';
    if (currentLevel === 'categories') return selectedStream!;
    if (currentLevel === 'programs') return selectedCategory!;
    if (currentLevel === 'specializations') return selectedProgram!;
    if (currentLevel === 'details') return selectedSpecialization!;
    return 'Career Library';
  };

  return (
    <Screen>
      <View style={styles.header}>
        {currentLevel !== 'streams' && (
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={palette.text} />
          </Pressable>
        )}
        <Text style={styles.title}>{getTitle()}</Text>
      </View>

      {currentLevel === 'details' ? (
        renderDetails()
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {currentLevel === 'streams' && renderStreams()}
          {currentLevel === 'categories' && renderCategories()}
          {currentLevel === 'programs' && renderPrograms()}
          {currentLevel === 'specializations' && renderSpecializations()}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.text,
  },
  container: {
    padding: 16,
    gap: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    color: palette.muted,
    textAlign: 'center',
  },
  list: {
    gap: 12,
  },
  programCard: {
    backgroundColor: palette.card,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  programEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  programTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    flex: 1,
  },
  fullCard: {
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  fullCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 8,
  },
  fullCardText: {
    fontSize: 13,
    color: palette.muted,
  },
  detailsContainer: {
    padding: 16,
  },
  lockedContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  lockedContentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  lockedContentText: {
    fontSize: 14,
    color: palette.muted,
    textAlign: 'center',
  },
  unlockButton: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  unlockButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  timerBanner: {
    backgroundColor: `${palette.orange}20`,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  timerText: {
    fontSize: 13,
    color: palette.orange,
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: palette.text,
    marginBottom: 16,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 13,
    color: palette.muted,
    lineHeight: 20,
  },
  pathStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.primary,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  stepText: {
    fontSize: 13,
    color: palette.text,
    flex: 1,
    lineHeight: 20,
  },
  examText: {
    fontSize: 13,
    color: palette.muted,
    marginBottom: 6,
  },
  jobText: {
    fontSize: 13,
    color: palette.muted,
    marginBottom: 6,
  },
  salaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.primary,
  },
  instituteText: {
    fontSize: 13,
    color: palette.muted,
    marginBottom: 6,
  },
});

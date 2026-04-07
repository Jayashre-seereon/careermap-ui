export const palette = {
  background: '#fbf7f3',
  surface: '#fffdfb',
  card: '#ffffff',
  border: '#eee4dc',
  text: '#251d24',
  muted: '#7d7580',
  primary: '#c11e38',
  primaryDeep: '#220b34',
  secondary: '#cb9c48',
  teal: '#2d8c83',
  green: '#2f9367',
  blue: '#3774d8',
  purple: '#8856c9',
  orange: '#e1712f',
  pink: '#d9608f',
  danger: '#d04f4f',
};

export const studentProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@email.com',
  mobile: '+91 98765 43210',
  standard: 'Class 11',
  stream: 'Science',
  subscription: 'Psychometric + Counselling',
};

export const heroStats = [
  { label: 'Saved Careers', value: '18', tone: palette.orange },
  { label: 'Tests Taken', value: '06', tone: palette.blue },
  { label: 'Mentor Sessions', value: '03', tone: palette.purple },
];

export const moduleCards = [
  {
    title: 'Career Library',
    subtitle: 'Explore streams, roles, and college paths.',
    icon: 'book-outline',
    route: '/(drawer)/(tabs)/library',
    tone: palette.blue,
  },
  {
    title: 'Assessment',
    subtitle: 'Discover aptitude and personality insights.',
    icon: 'analytics-outline',
    route: '/(drawer)/(tabs)/assessment',
    tone: palette.purple,
  },
  {
    title: 'Master Class',
    subtitle: 'Short expert-led learning videos.',
    icon: 'school-outline',
    route: '/(drawer)/(tabs)/learn',
    tone: palette.orange,
  },
  {
    title: 'Entrance Exam',
    subtitle: 'Practice tests and exam preparation guides.',
    icon: 'clipboard-outline',
    route: '/(drawer)/entrance-exam',
    tone: palette.teal,
  },
  {
    title: 'Institutes',
    subtitle: 'Browse top colleges and universities.',
    icon: 'business-outline',
    route: '/(drawer)/institute',
    tone: palette.pink,
  },
  {
    title: 'Book Mentor',
    subtitle: 'Reserve guidance with an expert mentor.',
    icon: 'people-outline',
    route: '/(drawer)/book-mentor',
    tone: palette.secondary,
  },
  {
    title: 'Scholarships',
    subtitle: 'Funding alerts and application deadlines.',
    icon: 'ribbon-outline',
    route: '/(drawer)/scholarship',
    tone: palette.green,
  },
  {
    title: 'Quiz',
    subtitle: 'Test your knowledge with fun quizzes.',
    icon: 'help-circle-outline',
    route: '/(drawer)/quiz',
    tone: palette.blue,
  },
  {
    title: 'Study Abroad',
    subtitle: 'Explore international education options.',
    icon: 'globe-outline',
    route: '/(drawer)/abroad',
    tone: palette.purple,
  },
 
];

export const streamCards = [
  { title: 'Science', emoji: 'Science', description: 'Medical, engineering, and research pathways.', tone: palette.blue },
  { title: 'Commerce', emoji: 'Commerce', description: 'Business, banking, management, and finance.', tone: palette.green },
  { title: 'Arts & Humanities', emoji: 'Arts', description: 'Design, media, writing, social impact, and law.', tone: palette.orange },
  { title: 'Vocational', emoji: 'Skills', description: 'Applied programs in hospitality, fashion, and trades.', tone: palette.pink },
];

export const featuredCareers = [
  {
    title: 'Computer Science Engineering',
    fit: 'Analytical + systems thinking',
    description: 'Build software, platforms, and intelligent products across web, mobile, AI, and cloud.',
    tag: 'Technology',
  },
  {
    title: 'General Medicine',
    fit: 'Empathy + scientific curiosity',
    description: 'Treat patients, diagnose conditions, and build long-term impact in healthcare.',
    tag: 'Medical',
  },
  {
    title: 'UX Design',
    fit: 'Creative + user-focused',
    description: 'Shape digital experiences with research, interaction design, and visual systems.',
    tag: 'Design',
  },
  {
    title: 'MBA Finance',
    fit: 'Business + numbers',
    description: 'Work in investment, planning, consulting, and leadership roles across industries.',
    tag: 'Business',
  },
];

export const featuredMentors = [
  { name: 'Dr. Priya Sharma', specialty: 'Career Counselling', rating: '4.9', experience: '12 yrs', accent: palette.primary },
  { name: 'Prof. Rahul Verma', specialty: 'Engineering', rating: '4.8', experience: '15 yrs', accent: palette.blue },
  { name: 'Ms. Anjali Singh', specialty: 'Design & Arts', rating: '4.7', experience: '8 yrs', accent: palette.orange },
];

export const featuredScholarships = [
  { name: 'INSPIRE Scholarship', amount: 'Rs 80,000 / year', deadline: 'March 2025', tag: 'Merit Based' },
  { name: 'KVPY Fellowship', amount: 'Rs 7,000 / month', deadline: 'August 2025', tag: 'Science' },
  { name: 'Pragati Scholarship', amount: 'Rs 50,000 / year', deadline: 'December 2024', tag: 'Girls in Tech' },
];

export const featuredInstitutes = [
  { name: 'IIT Bombay', location: 'Mumbai', type: 'Engineering' },
  { name: 'AIIMS Delhi', location: 'New Delhi', type: 'Medical' },
  { name: 'IIM Ahmedabad', location: 'Ahmedabad', type: 'Business' },
];

export const scholarships = [
  {
    name: 'INSPIRE Scholarship',
    eligibility: 'Top 1% in Class 12 board exams',
    amount: 'Rs 80,000 / year',
    deadline: 'March 2025',
    tag: 'Merit Based',
    status: 'Active',
    provider: 'Department of Science & Technology',
  },
  {
    name: 'National Talent Search',
    eligibility: 'Class 10 students',
    amount: 'Rs 1,250 / month',
    deadline: 'November 2024',
    tag: 'National',
    status: 'Active',
    provider: 'NCERT',
  },
  {
    name: 'KVPY Fellowship',
    eligibility: 'Class 11-12 science students',
    amount: 'Rs 7,000 / month',
    deadline: 'August 2025',
    tag: 'Science',
    status: 'Active',
    provider: 'IISc Bangalore',
  },
  {
    name: 'Pragati Scholarship',
    eligibility: 'Girl students in technical education',
    amount: 'Rs 50,000 / year',
    deadline: 'December 2024',
    tag: 'Girls in Tech',
    status: 'Expired',
    provider: 'AICTE',
  },
];

export const institutes = [
  {
    name: 'IIT Bombay',
    location: 'Mumbai, Maharashtra',
    courses: ['B.Tech', 'M.Tech', 'PhD'],
    rank: '#1',
    type: 'Engineering',
  },
  {
    name: 'AIIMS Delhi',
    location: 'New Delhi',
    courses: ['MBBS', 'MD', 'MS'],
    rank: '#1',
    type: 'Medical',
  },
  {
    name: 'IIM Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    courses: ['MBA', 'PGPX'],
    rank: '#1',
    type: 'Business',
  },
  {
    name: 'NID Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    courses: ['B.Des', 'M.Des'],
    rank: '#1',
    type: 'Design',
  },
];

export const assessmentFeatures = [
  '50 MCQ questions',
  'Aptitude and personality analysis',
  'AI-powered career matching',
  'Detailed report summary',
  'One-year validity per plan',
];

export const assessmentPolicies = [
  'Each subscription includes 1 psychometric test.',
  'Test validity lasts 1 year from purchase date.',
  'A new purchase is required for a retake.',
];

export const masterClasses = [
  {
    title: 'How to Choose the Right Engineering Branch',
    mentor: 'Dr. Rajesh Kumar',
    duration: '15 min',
    career: 'Engineering',
    locked: false,
  },
  {
    title: 'NEET Roadmap for Future Doctors',
    mentor: 'Dr. Sanjay Gupta',
    duration: '30 min',
    career: 'Medical',
    locked: true,
  },
  {
    title: 'Career in AI & Machine Learning',
    mentor: 'Prof. Sneha Patel',
    duration: '22 min',
    career: 'Technology',
    locked: true,
  },
  {
    title: 'UX Design Career Path',
    mentor: 'Ms. Ria Kapoor',
    duration: '15 min',
    career: 'Design',
    locked: false,
  },
  {
    title: 'MBA vs Direct Job After Graduation',
    mentor: 'Mr. Rohit Bansal',
    duration: '15 min',
    career: 'Business',
    locked: false,
  },
];

export const notifications = [
  {
    id: '1',
    title: 'Mentor session confirmed',
    message: 'Your counselling slot is booked for Saturday at 4:00 PM.',
    time: '2h ago',
    unread: true,
  },
  {
    id: '2',
    title: 'Scholarship alert',
    message: 'The Aspire STEM scholarship applications close in 5 days.',
    time: 'Yesterday',
    unread: true,
  },
  {
    id: '3',
    title: 'New master class added',
    message: 'A fresh session on entrance exam planning is now available.',
    time: '2 days ago',
    unread: false,
  },
];

export const subscriptions = [
  {
    id: 'psychometric',
    name: 'Psychometric Test',
    price: 'Rs 1,500',
    description: 'One annual test, quick summary, and starter career suggestions.',
    features: ['1 Psychometric Test', 'Basic report', 'Career suggestions'],
  },
  {
    id: 'premium',
    name: 'Psychometric + Counselling',
    price: 'Rs 3,000',
    description: 'The most complete student package from the web prototype.',
    features: ['Detailed report', '1-on-1 counselling', 'Mentor booking access'],
    recommended: true,
  },
  {
    id: 'infocentre',
    name: 'Infocentre Access',
    price: 'Rs 5,000',
    description: 'Premium library, videos, scholarships, and counselling support.',
    features: ['Career library', 'Master class videos', 'Scholarship info'],
  },
];

export const settingsItems = [
  'Edit Profile',
  'Notification Preferences',
  'Dark Mode Preview',
  'Help Centre',
];

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View ,Linking} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCareerLibraryCategoriesByStream, getCareerLibraryDetails, getCareerLibraryNext, getCareerLibraryStreams, startCareerLibraryPreview } from '../../../src/api/careerLibraryApi';
import { checkModuleAccess } from '../../../src/api/moduleAccessApi';
import { useAppState } from '../../../src/app-state';
import { Screen, UnlockBottomSheet, mobileAssistantScrollProps } from '../../../src/careermap-ui';
import { palette } from '../../../src/careermap-data';
import { StaggerFadeUpItem } from '../../../src/page-transition';
import { openSubscriptionPrompt } from '../../../src/subscription-flow';
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'react-native';

const fallbackStreams = [
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
function normalizeInstituteItems(value) {
    return toList(value).map((item, index) => {
        if (typeof item === 'string') {
            return {
                id: `institution-${index}`,
                name: item,
                state: '',
                city: '',
                country: '',
                location: item,
                type: '',
                logo: null,
                isTop: false,
                 url: null,   
            };
        }
        const city = item?.city || '';
        const state = item?.state || '';
        const country = item?.countruy || item?.country || '';
        const location = [city, state, country].filter(Boolean).join(', ') || item?.location || 'Location not available';
        return {
            id: item?.id ?? `institution-${index}`,
            name: item?.name || 'Institution',
            state,
            city,
            country,
            location,
            type: String(item?.institute_type || item?.type || '').trim(),
            logo: item?.logo || item?.image || null,
            isTop: Boolean(item?.is_top ?? item?.isTop),
             url: item?.url || null,  
        };
    });
}
function groupInstitutesByTopStatus(value) {
    const institutes = normalizeInstituteItems(value);
    const referenceState = 'Odisha';
    const topInstitutes = institutes.filter((item) => item.state === referenceState);
    const outsideInstitutes = institutes.filter((item) => item.state !== referenceState);
    return { institutes, topInstitutes, outsideInstitutes, referenceState };
}
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
const stripHtml = (value) => {
    if (!value) {
        return '';
    }
    return String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};
const toList = (value) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }
    if (!value) {
        return [];
    }
    return [value];
};
const formatCurrencyAmount = (value, currency = 'INR') => {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    const amount = Number(value);
    if (Number.isNaN(amount)) {
        return String(value);
    }

    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0,
        }).format(amount);
    }
    catch {
        return `${currency} ${amount.toLocaleString('en-IN')}`;
    }
};
const getMediaType = (url) => {
    if (!url) return null;
    const clean = String(url).split('?')[0].toLowerCase();
    if (/\.(mp4|webm|mov|ogg)$/.test(clean)) return 'video';
    if (/\.(gif)$/.test(clean)) return 'gif';
    if (/\.(jpg|jpeg|png|webp|svg)$/.test(clean)) return 'image';
    return 'image';
};
const formatSalaryRange = (salary) => {
    const currency = salary?.currency || 'INR';
    const minSalary = formatCurrencyAmount(salary?.minSalary, currency);
    const maxSalary = formatCurrencyAmount(salary?.maxSalary, currency);
    const profession = salary?.profession ? `${salary.profession}: ` : '';

    if (minSalary && maxSalary) {
        return `${profession}${minSalary}L to ${maxSalary}L/annum`;
    }

    return `${profession}${minSalary || maxSalary || 'Salary not available'}`;
};
const getSalaryBullets = (salary) => {
    if (!salary) {
        return [];
    }

    return [
        salary?.profession ? `Profession: ${salary.profession}` : '',
        salary?.minSalary ? `Minimum: ${formatCurrencyAmount(salary.minSalary, salary?.currency || 'INR')}` : '',
        salary?.maxSalary ? `Maximum: ${formatCurrencyAmount(salary.maxSalary, salary?.currency || 'INR')}` : '',
        salary?.scope ? `Scope: ${salary.scope}` : '',
        salary?.note || salary?.description || '',
    ].filter(Boolean);
};
const formatDate = (value) => {
    if (!value) {
        return 'Not available';
    }
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
        return String(value);
    }
    return parsedDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};
const getItemTitle = (item) => item?.title || item?.name || item?.subcategory?.title || item?.secondcategory?.name || item?.category?.title || item?.path || item?.examname || item?.pathName || `Item ${item?.id ?? ''}`.trim();
const getDetailTitle = (detail) => detail?.subcategory?.title || detail?.secondcategory?.name || detail?.category?.title || `Career Detail ${detail?.id ?? ''}`.trim();
const getDetailDescription = (detail) => stripHtml(detail?.subcategory?.description || detail?.secondcategory?.description || detail?.category?.description || detail?.subcategory?.specialization || detail?.secondcategory?.specialization || detail?.category?.specialization || '');
const educationIcons = ['school-outline', 'book-outline', 'library-outline', 'document-text-outline', 'ribbon-outline'];
const careerIcons = ['briefcase-outline', 'people-outline', 'albums-outline', 'folder-open-outline', 'sparkles-outline'];
const mixedIcons = [...educationIcons, ...careerIcons];
const hashString = (value) => {
    let hash = 0;
    const input = String(value ?? '');
    for (let index = 0; index < input.length; index += 1) {
        hash = (hash * 31 + input.charCodeAt(index)) | 0;
    }
    return Math.abs(hash);
};
const pickIcon = (seed, pool) => pool[hashString(seed) % pool.length];
const getDetailHeaderIcon = (detail) => {
    const seed = detail?.id ?? detail?.subcategory?.id ?? detail?.secondcategory?.id ?? detail?.category?.id ?? detail?.subcategory?.title ?? detail?.secondcategory?.name ?? detail?.category?.title;
    if (detail?.subcategory?.id != null) {
        return pickIcon(seed, educationIcons);
    }
    if (detail?.secondcategory?.id != null) {
        return pickIcon(seed, educationIcons);
    }
    return pickIcon(seed, careerIcons);
};
const getStepIcon = (type, item) => {
    const seed = item?.id ?? item?.title ?? item?.name ?? item?.path ?? `${type}-${item?.id ?? 'x'}`;
    if (type === 'category') {
        return pickIcon(seed, careerIcons);
    }
    if (type === 'second') {
        return pickIcon(seed, educationIcons);
    }
    if (type === 'sub') {
        return pickIcon(seed, mixedIcons);
    }
    if (type === 'preview') {
        return pickIcon(seed, mixedIcons);
    }
    return 'chevron-forward';
};
const getCareerAccessKey = (item) => String(item?.id ?? item?.title ?? item?.name ?? item?.path ?? '');
const getStreamIcon = (streamName) => {
    const normalized = String(streamName || '').toLowerCase();

    if (normalized.includes('science')) {
        return 'flask-outline';
    }
    if (normalized.includes('commerce')) {
        return 'calculator-outline';
    }
    if (normalized.includes('arts')) {
        return 'color-palette-outline';
    }
    if (normalized.includes('vocational')) {
        return 'hammer-outline';
    }
    return 'layers-outline';
};
const getStreamTone = (streamName) => {
    const normalized = String(streamName || '').toLowerCase();

    if (normalized.includes('science')) {
        return palette.blue;
    }
    if (normalized.includes('commerce')) {
        return palette.green;
    }
    if (normalized.includes('arts')) {
        return palette.orange;
    }
    if (normalized.includes('vocational')) {
        return palette.pink;
    }
    return palette.purple;
};

const extractListItems = (html) => {
    if (!html) return [];
    const matches = String(html).match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
    if (matches.length > 0) {
        return matches.map((li) => stripHtml(li)).filter(Boolean);
    }
    const plain = stripHtml(html);
    return plain ? [plain] : [];
};

const mapStreamItem = (item, index = 0) => {
    const fallback = fallbackStreams[index % fallbackStreams.length] || fallbackStreams[0];
    const title = item?.name || item?.title || item?.streamName || item?.label || fallback?.name || `Stream ${index + 1}`;
    return {
        id: item?.id ?? item?.streamId ?? index + 1,
        name: title,
        desc: stripHtml(item?.description || item?.desc || item?.about || fallback?.desc || ''),
        icon: getStreamIcon(title),
        tone: getStreamTone(title),
        raw: item,
    };
};
const normalizeStreamItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        return fallbackStreams.map((item, index) => mapStreamItem(item, index));
    }
    return items.map((item, index) => mapStreamItem(item, index));
};
const getCardTitle = (item) => item?.name || item?.title || item?.subcategory?.title || item?.secondcategory?.name || item?.category?.title || item?.path || item?.examname || item?.pathName || `Item ${item?.id ?? ''}`.trim();
const getCardDescription = (item) => stripHtml(item?.desc || item?.description || item?.about || item?.specialization || item?.subcategory?.description || item?.secondcategory?.description || item?.category?.description || item?.path || '');
export default function CareerLibraryScreen() {
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const { canAccessFreeDetail, isUnlocked, preferences, registerFreeDetailAccess } = useAppState();
    const [currentLevel, setCurrentLevel] = useState('streams');
    const [selectedStream, setSelectedStream] = useState(null);
    const [streamItems, setStreamItems] = useState(normalizeStreamItems([]));
    const [categories, setCategories] = useState([]);
    const [secondCategories, setSecondCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [details, setDetails] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSecondCategory, setSelectedSecondCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedDetailSource, setSelectedDetailSource] = useState(null);
    const [selectedInstituteType, setSelectedInstituteType] = useState('All');
    const [detailReturnLevel, setDetailReturnLevel] = useState('subcategory');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showUnlockSheet, setShowUnlockSheet] = useState(false);
    const [hasFullAccess, setHasFullAccess] = useState(false);
   const [moduleStatus, setModuleStatus] = useState('locked');
    const [lockSheetDismissible, setLockSheetDismissible] = useState(true);
    const [isCategoryFree, setIsCategoryFree] = useState(false);
    const [previewSessionId, setPreviewSessionId] = useState(null);
    const [previewRemaining, setPreviewRemaining] = useState(0);
    const [previewExpired, setPreviewExpired] = useState(false);
    const previewIntervalRef = useRef(null);
    const resolvedModuleId = useMemo(() => {
        const parsed = Number(params.moduleId);
        return Number.isFinite(parsed) ? parsed : 60;
    }, [params.moduleId]);

    const resetToStreams = () => {
        setShowUnlockSheet(false);
        setLockSheetDismissible(true);
        setSelectedStream(null);
        setSelectedCategory(null);
        setSelectedSecondCategory(null);
        setSelectedSubCategory(null);
        setSelectedDetailSource(null);
        setDetails([]);
        setCurrentLevel('streams');
        setDetailReturnLevel('subcategory');
        setIsCategoryFree(false);
        setPreviewSessionId(null);
        setPreviewRemaining(0);
        setPreviewExpired(false);
        if (previewIntervalRef.current) {
            clearInterval(previewIntervalRef.current);
            previewIntervalRef.current = null;
        }
    };
    useEffect(() => {
        let isMounted = true;

        const loadStreams = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getCareerLibraryStreams();
                const items = Array.isArray(response?.data) ? response.data : [];

                if (isMounted) {
                    setStreamItems(normalizeStreamItems(items));
                }
            }
            catch (_fetchError) {
                if (isMounted) {
                    setError('Unable to load streams right now.');
                    setStreamItems(normalizeStreamItems([]));
                }
            }
            finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadStreams();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!previewRemaining) return;

        previewIntervalRef.current = setInterval(() => {
            setPreviewRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(previewIntervalRef.current);
                    previewIntervalRef.current = null;
                    setPreviewExpired(true);
                    setLockSheetDismissible(false);
                    setShowUnlockSheet(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (previewIntervalRef.current) {
                clearInterval(previewIntervalRef.current);
                previewIntervalRef.current = null;
            }
        };
    }, [previewRemaining]);
   useEffect(() => {
    let isMounted = true;
    const loadModuleAccess = async () => {
        try {
            const response = await checkModuleAccess(resolvedModuleId);
            if (isMounted && response?.allowed) {
                setModuleStatus(String(response?.mode || 'locked').toLowerCase());
                setHasFullAccess(String(response?.mode || '').toLowerCase() === 'full');
            }
        }
        catch {
            if (isMounted) {
                setHasFullAccess(false);
            }
        }
    };
    loadModuleAccess();
    return () => {
        isMounted = false;
    };
}, [resolvedModuleId]);
    useFocusEffect(useCallback(() => {
        if (typeof params.level !== 'string' || !['streams', 'categories', 'secondcategory', 'subcategory', 'details'].includes(params.level)) {
            resetToStreams();
        }
    }, [params.level]));
    useEffect(() => {
        if (typeof params.level === 'string' && ['streams', 'categories', 'secondcategory', 'subcategory', 'details'].includes(params.level)) {
            setCurrentLevel(params.level);
        }
    }, [params.level]);
    const animationKey = `${currentLevel}-${selectedStream?.id ?? 'none'}-${selectedCategory?.id ?? 'none'}-${selectedSecondCategory?.id ?? 'none'}-${selectedSubCategory?.id ?? 'none'}`;
    const detailKey = selectedDetailSource?.id != null ? String(selectedDetailSource.id) : selectedSubCategory?.id != null ? String(selectedSubCategory.id) : null;
    const detailUnlocked = detailKey ? (hasFullAccess || canAccessFreeDetail('career-library', detailKey) || isCategoryFree) : true;
    const returnTarget = useMemo(() => ({
        pathname: '/(drawer)/(tabs)/library',
        params: {
            level: currentLevel,
            streamId: selectedStream?.id,
            categoryId: selectedCategory?.id,
            secondCategoryId: selectedSecondCategory?.id,
            subCategoryId: selectedSubCategory?.id,
        },
    }), [currentLevel, selectedStream, selectedCategory, selectedSecondCategory, selectedSubCategory, isCategoryFree]);
    const createPreviewSession = async (pageType, pageId, item) => {
        if (moduleStatus !== 'preview') {
            return null;
        }

        try {
            const preview = await startCareerLibraryPreview({
                moduleId: resolvedModuleId,
                pageType,
                pageId,
            });

            setPreviewSessionId(preview?.previewSessionId || preview?.access?.previewSessionId || preview?.access?.sessionId || null);
            setPreviewRemaining(preview?.remainingSeconds ?? preview?.access?.remainingSeconds ?? preview?.previewDurationSeconds ?? preview?.access?.previewDurationSeconds ?? 15);

            return preview?.previewSessionId || preview?.access?.previewSessionId || preview?.access?.sessionId || null;
        } catch (err) {
            if (err?.response?.status === 403) {
                setLockSheetDismissible(true);
                setShowUnlockSheet(true);
                return null;
            }
            throw err;
        }
    }
    const handleClick = async (type, id, item) => {
        setLoading(true);
        setError('');
        setSelectedDetailSource(null);
        if (type === 'stream') {
            setSelectedStream(item);
            setSelectedCategory(null);
            setSelectedSecondCategory(null);
            setSelectedSubCategory(null);
            setDetails([]);
            setCurrentLevel('categories');
            setDetailReturnLevel('streams');
            try {
                const response = await getCareerLibraryCategoriesByStream(id, resolvedModuleId);
                const data = response ?? {};
                const nextItems = Array.isArray(data?.data) ? data.data : [];
                setCategories(nextItems);
                setSecondCategories([]);
                setSubCategories([]);
                setDetails([]);
                setCurrentLevel('categories');
            }
            catch (_fetchError) {
                setError('Unable to load categories. Please try again.');
            }
            finally {
                setLoading(false);
            }
            return;
        }
        else if (type === 'category') {
            setSelectedCategory(item);
            setDetailReturnLevel('categories');
            const accessTier = String(item?.accessTier || '').toLowerCase();
            setIsCategoryFree(hasFullAccess || accessTier === 'preview');
            try {
                const response = await getCareerLibraryNext(type, id);
                const data = response ?? {};
                const nextItems = Array.isArray(data?.data) ? data.data : [];
                if (data.type === 'secondcategory') {
                    setSecondCategories(nextItems);
                    setSubCategories([]);
                    setDetails([]);
                    setCurrentLevel('secondcategory');
                }
                else if (data.type === 'details') {
                    let detailItems = nextItems;
                    if (detailItems.length === 0) {
                        try {
                            const detailResponse = await getCareerLibraryDetails(id);
                            const detailData = detailResponse ?? {};
                            detailItems = Array.isArray(detailData?.data) ? detailData.data : [];
                        } catch (_err) {
                            detailItems = [];
                        }
                    }
                    setSelectedDetailSource(item);
                    setDetails(detailItems);
                    setCurrentLevel('details');
                    if (item?.id != null) {
                        registerFreeDetailAccess('career-library', String(item.id));
                    }
                }
                else {
                    setSecondCategories(nextItems);
                    setSubCategories([]);
                    setDetails([]);
                    setCurrentLevel('secondcategory');
                }
            }
            catch (_fetchError) {
                setError('Unable to load the next step. Please try again.');
            }
            finally {
                setLoading(false);
            }
            return;
        }
        else if (type === 'second') {
            setSelectedSecondCategory(item);
            setDetailReturnLevel('secondcategory');
            try {
                const response = await getCareerLibraryNext(type, id);
                const data = response ?? {};
                const nextItems = Array.isArray(data?.data) ? data.data : [];
                if (data.type === 'subcategory') {
                    setSubCategories(nextItems);
                    setDetails([]);
                    setCurrentLevel('subcategory');
                }
                else if (data.type === 'details') {
                    let detailItems = nextItems;
                    if (detailItems.length === 0) {
                        try {
                            const detailResponse = await getCareerLibraryDetails(id);
                            const detailData = detailResponse ?? {};
                            detailItems = Array.isArray(detailData?.data) ? detailData.data : [];
                        } catch (_err) {
                            detailItems = [];
                        }
                    }
                    setSelectedDetailSource(item);
                    setDetails(detailItems);
                    setCurrentLevel('details');
                    if (item?.id != null) {
                        registerFreeDetailAccess('career-library', String(item.id));
                    }
                }
                else {
                    setSubCategories(nextItems);
                    setDetails([]);
                    setCurrentLevel('subcategory');
                }
            }
            catch (_fetchError) {
                setError('Unable to load the next step. Please try again.');
            }
            finally {
                setLoading(false);
            }
            return;
        }
        else if (type === 'sub') {
            setSelectedSubCategory(item);
            setDetailReturnLevel('subcategory');
            try {
                const response = await getCareerLibraryNext(type, id);
                const data = response ?? {};
                const nextItems = Array.isArray(data?.data) ? data.data : [];
                if (data.type === 'details') {
                    let previewId = null;

                    if (moduleStatus === 'preview') {
                        previewId = await createPreviewSession('sub', id, item);
                        if (!previewId) {
                            setLoading(false);
                            return;
                        }
                    }

                    let detailItems = nextItems;
                    if (detailItems.length === 0) {
                        try {
                            const detailResponse = await getCareerLibraryDetails(id, resolvedModuleId, previewId);
                            const detailData = detailResponse ?? {};
                            detailItems = Array.isArray(detailData?.data) ? detailData.data : [];
                        } catch (_err) {
                            detailItems = [];
                        }
                    }
                    setSelectedDetailSource(item);
                    setDetails(detailItems);
                    setCurrentLevel('details');
                    if (item?.id != null) {
                        registerFreeDetailAccess('career-library', String(item.id));
                    }
                }
                else if (nextItems.length > 0) {
                    setSelectedDetailSource(item);
                    setDetails(nextItems);
                    setCurrentLevel('details');
                    if (item?.id != null) {
                        registerFreeDetailAccess('career-library', String(item.id));
                    }
                }
                else {
                    setSelectedDetailSource(item);
                    setDetails([]);
                    setCurrentLevel('details');
                    if (item?.id != null) {
                        registerFreeDetailAccess('career-library', String(item.id));
                    }
                }
            }
            catch (_fetchError) {
                setError('Unable to load the next step. Please try again.');
            }
            finally {
                setLoading(false);
            }
            return;
        }
        setLoading(false);
    };
    const handleBack = () => {
        if (currentLevel === 'details') {
            setCurrentLevel(detailReturnLevel);
        }
        else if (currentLevel === 'subcategory') {
            setCurrentLevel('secondcategory');
        }
        else if (currentLevel === 'categories') {
            setCurrentLevel('streams');
        }
        else {
            setCurrentLevel('streams');
        }
    };
    const renderStreamGrid = (items) => (<View className="flex-row flex-wrap gap-3">
      {items.map((item, index) => (<StaggerFadeUpItem key={`stream-${item?.id ?? index}`} index={index} style={{ width: '48%', flexGrow: 0, flexShrink: 0 }}>
          <Pressable onPress={() => {
                handleClick('stream', item?.id, item);
            }} className={`w-full gap-3 rounded-[20px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
            <View className="flex-row items-start justify-between gap-2">
              <View className="h-[44px] w-[44px] items-center justify-center rounded-[16px]" style={{ backgroundColor: `${(item?.tone || getStreamTone(item?.name))}15` }}>
                <Ionicons name={item?.icon || getStreamIcon(item?.name)} size={22} color={item?.tone || getStreamTone(item?.name)}/>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.primary}/>
            </View>
            <View className="gap-1">
              <Text numberOfLines={1} className={`text-[15px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item?.name}</Text>
              <Text numberOfLines={2} className={`text-[12px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item?.desc || 'Explore this stream.'}</Text>
            </View>
          </Pressable>
        </StaggerFadeUpItem>))}
    </View>);
    const renderCategoryGrid = (items) => (<View className="gap-3">
      {items.map((item, index) => {
            const accessTier = String(item?.accessTier || '').toLowerCase();
            const unlockedItem = hasFullAccess || accessTier === 'preview';
            return (<StaggerFadeUpItem key={`category-${item?.id ?? index}`} index={index}>
          <Pressable onPress={() => {
                    if (!hasFullAccess && accessTier !== 'preview') {
                        setLockSheetDismissible(true);
                        setShowUnlockSheet(true);
                        return;
                    }
                    handleClick('category', item?.id, item);
                }} className={`w-full flex-row items-center gap-3 rounded-[18px] border px-3 py-3.5 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
            <View className="h-[40px] w-[40px] items-center justify-center rounded-[14px]" style={{ backgroundColor: `${palette.primary}12` }}>
              <Ionicons name={getStepIcon('category', item)} size={20} color={palette.primary}/>
            </View>
            <View className="flex-1">
              <Text className={`text-[14px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{getCardTitle(item)}</Text>
              {getCardDescription(item) ? (<Text numberOfLines={1} className={`mt-0.5 text-[12px] leading-4 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{getCardDescription(item)}</Text>) : null}
            </View>
            <View className="items-end gap-2">
              <View className="rounded-full px-2 py-1" style={{ backgroundColor: unlockedItem ? `${palette.green}14` : '#f8e8d8' }}>
                  <Text className="text-[10px] font-black" style={{ color: unlockedItem ? palette.green : palette.primary }}>{unlockedItem ? 'FREE' : 'LOCK'}</Text>
                </View>
              <Ionicons name="chevron-forward" size={18} color={palette.primary}/>
            </View>
          </Pressable>
        </StaggerFadeUpItem>);
        })}
    </View>);
    const renderStepList = (items, type) => (<View className="gap-3">
      {items.map((item, index) => {
            const accessKey = getCareerAccessKey(item);
            const unlockedItem = hasFullAccess || isUnlocked('career-library') || canAccessFreeDetail('career-library', accessKey) || isCategoryFree;
            return (<StaggerFadeUpItem key={`${type}-${item?.id ?? index}`} index={index}>
          <Pressable onPress={() => {
                    if (!unlockedItem) {
                        setLockSheetDismissible(true);
                        setShowUnlockSheet(true);
                        return;
                    }
                    handleClick(type, item?.id, item);
                }} className={`flex-row items-center rounded-[14px] border p-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
            <View className={`mr-3 h-10 w-10 items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#fff0e8]'}`}>
              <Ionicons name={getStepIcon(type, item)} size={18} color={palette.primary}/>
            </View>
            <View className="flex-1">
              <Text className={`text-[15px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{getCardTitle(item)}</Text>
              {getCardDescription(item) ? (<Text className={`mt-1 text-[12px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{getCardDescription(item)}</Text>) : null}
            </View>
            <View className="mr-2 rounded-full px-2 py-1" style={{ backgroundColor: unlockedItem ? `${palette.green}14` : '#f8e8d8' }}>
                <Text className="text-[10px] font-black" style={{ color: unlockedItem ? palette.green : palette.primary }}>{unlockedItem ? 'FREE' : 'LOCK'}</Text>
              </View>
            <Ionicons name="chevron-forward" size={18} color={palette.primary}/>
          </Pressable>
        </StaggerFadeUpItem>);
        })}
    </View>);
    const renderDetailItem = (detail, index) => {
        const title = getDetailTitle(detail);
        const instituteGroups = groupInstitutesByTopStatus(detail?.institutions);
        const salaryBullets = toList(detail?.salaryRanges).flatMap((salary) => getSalaryBullets(salary));
        const instituteTypeFilter = String(selectedInstituteType || 'All').toLowerCase();
        const filteredTopInstitutes = instituteGroups.topInstitutes.filter((institution) => {
            if (!instituteTypeFilter || instituteTypeFilter === 'all') {
                return true;
            }
            return String(institution?.type || '').toLowerCase().includes(instituteTypeFilter);
        });
        const filteredOutsideInstitutes = instituteGroups.outsideInstitutes.filter((institution) => {
            if (!instituteTypeFilter || instituteTypeFilter === 'all') {
                return true;
            }
            return String(institution?.type || '').toLowerCase().includes(instituteTypeFilter);
        });
        return (<StaggerFadeUpItem key={`detail-${detail?.id ?? index}`} index={index}>
          <View className="mb-4">
     {detail?.media ? (
  <View className="mb-3 overflow-hidden rounded-[20px]" style={{ height: 180 }}>
  {getMediaType(detail.media) === 'video' ? (
  <Video
    source={{ uri: detail.media }}
    style={{ width: '100%', height: '100%' }}
    resizeMode={ResizeMode.COVER}
    isLooping
    isMuted
    shouldPlay
  />
) : (
      <Image
        source={{ uri: detail.media }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    )}
    <View
      className="absolute inset-x-0 bottom-0 px-4 py-3"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <Text className="text-[18px] font-black text-white">{title}</Text>
      {getDetailDescription(detail) ? (
        <Text className="mt-0.5 text-[12px] text-white/85" numberOfLines={1}>
          {getDetailDescription(detail)}
        </Text>
      ) : null}
    </View>
  </View>
) : (
  
  <View className="mb-3 flex-row items-start gap-3">
    <View className={`h-[56px] w-[56px] items-center justify-center rounded-[18px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#ffecef]'}`}>
      <Ionicons name={getDetailHeaderIcon(detail)} size={26} color={palette.primary}/>
    </View>
    <View className="flex-1">
      <Text className={`text-[20px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{title}</Text>
      {getDetailDescription(detail) ? (
        <Text className={`mt-1 text-[12px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
          {getDetailDescription(detail)}
        </Text>
      ) : null}
    </View>
  </View>
)}

{previewRemaining > 0 ? (<View className="mb-3 rounded-[12px] px-3 py-3" style={{ backgroundColor: `${palette.primary}14` }}>
              <Text className="text-[12px] font-semibold" style={{ color: palette.primary }}>
              <Ionicons name="time-outline" size={14} color={palette.primary} className="mr-1"/> Preview active for {previewRemaining}s
              </Text>
            </View>) : null}
{detail?.description ? (
    <View className={`mb-4 rounded-[20px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111]' : 'border-line bg-card'}`}>
        <View className="mb-3 flex-row items-center gap-2">
            <Ionicons name="information-circle-outline" size={16} color={palette.primary}/>
            <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>About</Text>
        </View>
        <Text className={`text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
            {detail.description}
        </Text>
    </View>
) : null}
               <View className={`mb-4 rounded-[20px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111]' : 'border-line bg-card'}`}>
  <View className="mb-3 flex-row items-center gap-2">
    <Ionicons name="map-outline" size={16} color={palette.primary}/>
    <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
      Career Paths{toList(detail?.careerpaths).length > 1 ? ` (${toList(detail?.careerpaths).length})` : ''}
    </Text>
  </View>

  {toList(detail?.careerpaths).length > 0 ? toList(detail?.careerpaths).map((pathItem, pathIdx) => (
    <View
      key={pathItem?.id ?? pathIdx}
      className={`mb-3 overflow-hidden rounded-[16px] border ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#0b0b0b]' : 'border-[#f0e4e2] bg-[#fdf9f9]'}`}
    >
      {/* Path header */}
      <View className={`flex-row items-center gap-2 border-b px-3 py-2.5 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#141414]' : 'border-[#f0e4e2] bg-[#fff0ee]'}`}>
        <View className="h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: palette.primary }}>
          <Text className="text-[11px] font-black text-white">{pathIdx + 1}</Text>
        </View>
        <Text className={`text-[13px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
          {pathItem?.path?.pathtype || pathItem?.pathName || `Path ${pathIdx + 1}`}
        </Text>
      </View>

      {/* Details grid */}
      <View className="px-3 py-2.5">
        {[
          { label: 'Stream', value: detail?.stream?.name },
          { label: 'Graduation', value: pathItem?.graduation },
          { label: 'After Graduation', value: pathItem?.aftergraduation },
          { label: 'After Post Graduation', value: pathItem?.afterpostgraduation },
          { label: 'Any Other', value: pathItem?.anyother },
        ]
          .filter((row) => row.value)
          .map((row) => (
            <View key={row.label} className="mb-1.5 flex-row items-start gap-3">
              <Text className={`w-[130px] text-[11px] font-semibold ${preferences.darkMode ? 'text-[#f0b0aa]' : 'text-brand'}`}>{row.label}</Text>
              <Text className={`flex-1 text-[12px] leading-4 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{row.value}</Text>
            </View>
          ))}
        {[pathItem?.graduation, pathItem?.aftergraduation, pathItem?.afterpostgraduation, pathItem?.anyother].every((v) => !v) ? (
          <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No further path details available.</Text>
        ) : null}
      </View>
    </View>
  )) : (<Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Career path details not available.</Text>)}
</View>
<View className={`rounded-[20px] mb-4 border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111]' : 'border-line bg-card'}`}>
  <View className="mb-3 flex-row items-center gap-2">
    <Ionicons name="reader-outline" size={16} color={palette.primary}/>
    <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Entrance Exams</Text>
  </View>
  {toList(detail?.entranceexams).length > 0 ? toList(detail?.entranceexams).map((exam) => (<View key={exam?.id} className="mb-3 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className={`text-[13px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{exam?.examname || 'Exam'}</Text>
        <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{[exam?.mode, exam?.duration, formatDate(exam?.exam_date)].filter(Boolean).join(' • ')}</Text>
      </View>
      {exam?.url ? (<Pressable onPress={() => Linking.openURL(exam.url)} className="h-9 w-9 items-center justify-center rounded-full ml-2" style={{ borderWidth: 1, borderColor: '#f0e4e2' }}>
          <Ionicons name="arrow-forward" size={16} color={palette.primary}/>
        </Pressable>) : null}
    </View>)) : (<Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Exam details not available.</Text>)}
</View>
            <View className={`mb-4 rounded-[20px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111]' : 'border-line bg-card'}`}>
              <View className="mb-3 flex-row items-center gap-2">
                <Ionicons name="briefcase-outline" size={16} color={palette.primary}/>
                <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Job Scope</Text>
              </View>
              {toList(detail?.jobScope).length > 0 ? toList(detail?.jobScope).map((scope) => (<View key={scope} className="mb-2 flex-row items-start">
                  <Ionicons name="ellipse" size={6} color={palette.secondary} style={{ marginRight: 8, marginTop: 7 }}/>
                  <Text className={`flex-1 text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{scope}</Text>
                </View>)) : (<Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Job scope not available.</Text>)}
            </View>
            <View className={`mb-4 rounded-[20px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111]' : 'border-line bg-card'}`}>
  <View className="mb-3 flex-row items-center gap-2">
    <Ionicons name="star-outline" size={16} color={palette.primary}/>
    <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Specialization</Text>
  </View>
  {extractListItems(detail?.specialization).length > 0 ? extractListItems(detail?.specialization).map((item, i) => (
    <View key={i} className="mb-2 flex-row items-start">
      <Ionicons name="star" size={12} color={palette.primary} style={{ marginRight: 8, marginTop: 3 }}/>
      <Text className={`flex-1 text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item}</Text>
    </View>
  )) : (<Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Not available.</Text>)}
</View>

<View className={`mb-4 rounded-[20px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111]' : 'border-line bg-card'}`}>
  <View className="mb-3 flex-row items-center gap-2">
    <Ionicons name="checkmark-circle-outline" size={16} color={palette.primary}/>
    <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Important Factors</Text>
  </View>
  {extractListItems(detail?.important_factor).length > 0 ? extractListItems(detail?.important_factor).map((item, i) => (
    <View key={i} className="mb-2 flex-row items-start">
      <Ionicons name="checkmark-circle" size={12} color={palette.primary} style={{ marginRight: 8, marginTop: 3 }}/>
      <Text className={`flex-1 text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item}</Text>
    </View>
  )) : (<Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Not available.</Text>)}
</View>
            <View className={`mb-4 rounded-[20px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111]' : 'border-line bg-card'}`}>
              <View className="mb-3 flex-row items-center gap-2">
    <Ionicons name="cash-outline" size={16} color={palette.primary}/>
    <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Salary Range</Text>
  </View>
            {toList(detail?.salaryRanges).length > 0 ? (
  <View className="gap-2">
    {toList(detail?.salaryRanges).map((salary, salaryIndex) => (
      <View key={salary?.id ?? salaryIndex} className="flex-row items-start gap-2">
        <Ionicons name="ellipse" size={6} color={palette.primary} style={{ marginTop: 7 }} />
        <Text className="flex-1 text-[15px] font-bold text-brand">
          {formatSalaryRange(salary)}
        </Text>
      </View>
    ))}
  </View>
) : (
  <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
    Salary details not available.
  </Text>
)}
            </View>
            <View className={`mb-4 rounded-[20px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111]' : 'border-line bg-card'}`}>
              <View className="mb-3 flex-row items-center gap-2">
                <Ionicons name="school-outline" size={16} color={palette.primary}/>
                <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Top Institutes</Text>
              </View>
              <View className="mb-3 flex-row flex-wrap gap-2">
                {['All', 'Government', 'Private'].map((type) => {
                    const active = selectedInstituteType === type;
                    return (<Pressable key={type} onPress={() => setSelectedInstituteType(type)} className={`rounded-full px-3 py-1.5 ${active ? 'bg-brand' : preferences.darkMode ? 'bg-[#1a1a1a]' : 'bg-[#f2ebe6]'}`}>
                        <Text className={`text-[11px] font-bold ${active ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{type}</Text>
                      </Pressable>);
                })}
              </View>
              <View className="gap-4">
            {filteredTopInstitutes.length > 0 ? (<View>
    <Text className={`mb-2 text-[12px] font-black uppercase tracking-[1px] ${preferences.darkMode ? 'text-[#f0b0aa]' : 'text-brand'}`}>
      {instituteGroups.referenceState ? `Top Institutes of ${instituteGroups.referenceState}` : 'Top Institutes'}
    </Text>
    {filteredTopInstitutes.map((institution) => (<View key={institution?.id} className="mb-3 flex-row items-center gap-3 rounded-[14px] border border-[#f0e4e2] bg-[#fdf9f9] px-3 py-3">
        <View className="h-[48px] w-[48px] overflow-hidden rounded-[12px]" style={{ backgroundColor: `${palette.primary}12` }}>
          {institution?.logo ? (<Image source={{ uri: institution.logo }} style={{ width: '100%', height: '100%' }} resizeMode="cover"/>) : (<View className="flex-1 items-center justify-center">
              <Ionicons name="business-outline" size={20} color={palette.primary}/>
            </View>)}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className={`text-[14px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{institution?.name || 'Institution'}</Text>
            {institution?.type ? (<View className="rounded-full px-2 py-0.5" style={{ backgroundColor: `${palette.primary}12` }}>
                <Text className="text-[10px] font-bold" style={{ color: palette.primary }}>{institution.type}</Text>
              </View>) : null}
          </View>
          <Text className={`mt-1 text-[12px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{institution?.location || 'Location not available'}</Text>
        </View>
        {institution?.url ? (<Pressable onPress={() => Linking.openURL(institution.url)} className="h-9 w-9 items-center justify-center rounded-full" style={{ borderWidth: 1, borderColor: '#f0e4e2' }}>
            <Ionicons name="arrow-forward" size={16} color={palette.primary}/>
          </Pressable>) : null}
      </View>))}
  </View>) : null}
             {filteredOutsideInstitutes.length > 0 ? (<View>
    <Text className={`mb-2 text-[12px] font-black uppercase tracking-[1px] ${preferences.darkMode ? 'text-[#f0b0aa]' : 'text-brand'}`}>
      {instituteGroups.referenceState ? `Top Institutes Outside ${instituteGroups.referenceState}` : 'Top Institutes Outside State'}
    </Text>
    {filteredOutsideInstitutes.map((institution) => (<View key={institution?.id} className="mb-3 flex-row items-center gap-3 rounded-[14px] border border-[#f0e4e2] bg-white px-3 py-3">
        <View className="h-[48px] w-[48px] overflow-hidden rounded-[12px]" style={{ backgroundColor: `${palette.primary}12` }}>
          {institution?.logo ? (<Image source={{ uri: institution.logo }} style={{ width: '100%', height: '100%' }} resizeMode="cover"/>) : (<View className="flex-1 items-center justify-center">
              <Ionicons name="business-outline" size={20} color={palette.primary}/>
            </View>)}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className={`text-[14px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{institution?.name || 'Institution'}</Text>
            {institution?.type ? (<View className="rounded-full px-2 py-0.5" style={{ backgroundColor: `${palette.primary}12` }}>
                <Text className="text-[10px] font-bold" style={{ color: palette.primary }}>{institution.type}</Text>
              </View>) : null}
          </View>
          <Text className={`mt-1 text-[12px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{institution?.location || 'Location not available'}</Text>
        </View>
        {institution?.url ? (<Pressable onPress={() => Linking.openURL(institution.url)} className="h-9 w-9 items-center justify-center rounded-full" style={{ borderWidth: 1, borderColor: '#f0e4e2' }}>
            <Ionicons name="arrow-forward" size={16} color={palette.primary}/>
          </Pressable>) : null}
      </View>))}
  </View>) : null}
                {!filteredTopInstitutes.length && !filteredOutsideInstitutes.length ? (<Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Institution details not available.</Text>) : null}
              </View>
            </View>
        
            
          </View>
        </StaggerFadeUpItem>);
    };
    const getTitle = () => {
        if (currentLevel === 'streams') {
            return 'Career Library';
        }
        if (currentLevel === 'categories') {
            return selectedStream?.name || 'Career Library';
        }
        if (currentLevel === 'secondcategory') {
            return getItemTitle(selectedCategory);
        }
        if (currentLevel === 'subcategory') {
            return getItemTitle(selectedSecondCategory);
        }
        if (currentLevel === 'details') {
            return getItemTitle(selectedDetailSource || selectedSubCategory || selectedSecondCategory || selectedCategory);
        }
        return 'Career Library';
    };
    return (<Screen scroll={true} animationKey={animationKey}>
      <View className="flex-row items-center">
        {currentLevel !== 'streams' && (<Pressable onPress={handleBack} className="mr-3 h-10 w-10 items-center justify-center rounded-full">
            <Ionicons name="chevron-back" size={24} color={preferences.darkMode ? '#ffffff' : palette.text}/>
          </Pressable>)}
        <Text className={`text-[18px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{getTitle()}</Text>
      </View>

      {currentLevel === 'streams' ? (<ScrollView className="flex-1" contentContainerClassName="gap-3 px-5 pb-2" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 72, 88) }} showsVerticalScrollIndicator={false} {...mobileAssistantScrollProps}>
          {loading ? (<Text className={`mt-4 text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading streams...</Text>) : null}
          {error ? (<Text className="mt-4 text-[13px] font-semibold text-red-500">{error}</Text>) : null}
          {renderStreamGrid(streamItems)}
        </ScrollView>) : currentLevel === 'categories' ? (<ScrollView className="flex-1" contentContainerClassName="gap-3 px-5 pb-2" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 72, 88) }} showsVerticalScrollIndicator={false} {...mobileAssistantScrollProps}>
          {loading ? (<Text className={`mt-4 text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading categories...</Text>) : null}
          {error ? (<Text className="mt-4 text-[13px] font-semibold text-red-500">{error}</Text>) : null}
          {renderCategoryGrid(categories)}
        </ScrollView>) : currentLevel === 'details' ? (<ScrollView className="flex-1" contentContainerClassName="gap-3 px-5 pb-2" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 72, 88) }} showsVerticalScrollIndicator={false} {...mobileAssistantScrollProps}>
          {loading ? (<Text className={`mt-4 text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading details...</Text>) : null}
          {error ? (<Text className="mt-4 text-[13px] font-semibold text-red-500">{error}</Text>) : null}
         
          {details.length > 0 ? details.map((detail, index) => renderDetailItem(detail, index)) : !loading ? (<Text className={`mt-4 text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No details available for this selection.</Text>) : null}
        </ScrollView>) : (<ScrollView className="flex-1" contentContainerClassName="gap-3 px-5 pb-2" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 72, 88) }} showsVerticalScrollIndicator={false} {...mobileAssistantScrollProps}>
          {loading ? (<Text className={`mt-4 text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading...</Text>) : null}
          {error ? (<Text className="mt-4 text-[13px] font-semibold text-red-500">{error}</Text>) : null}
          {currentLevel === 'secondcategory' && renderStepList(secondCategories, 'second')}
          {currentLevel === 'subcategory' && renderStepList(subCategories, 'sub')}
        </ScrollView>)}
      {showUnlockSheet ? (<UnlockBottomSheet title="Unlock Career Library" subtitle={previewExpired ? 'Your preview time has ended for this career detail.' : 'Subscribe to more careers, salary insights, education paths, and institute details.'} dismissible={lockSheetDismissible} onClose={resetToStreams} onPress={() => {
                setShowUnlockSheet(false);
                openSubscriptionPrompt(returnTarget);
            }}/>) : null}
    </Screen>);
}

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { palette } from '../../src/careermap-data';
import { Screen, SectionHeader } from '../../src/careermap-ui';

const exams = [
    { name: 'JEE Main', authority: 'NTA', date: 'April 2025', eligibility: 'Class 12 pass (PCM)', type: 'Central', category: 'Engineering' },
    { name: 'NEET UG', authority: 'NTA', date: 'May 2025', eligibility: 'Class 12 pass (PCB)', type: 'Central', category: 'Medical' },
    { name: 'CLAT', authority: 'NLUs', date: 'December 2024', eligibility: 'Class 12 pass', type: 'Central', category: 'Law' },
    { name: 'CUET', authority: 'NTA', date: 'May 2025', eligibility: 'Class 12 pass', type: 'Central', category: 'General' },
    { name: 'BITSAT', authority: 'BITS Pilani', date: 'May 2025', eligibility: 'Class 12 (PCM)', type: 'Private', category: 'Engineering' },
    { name: 'CAT', authority: 'IIMs', date: 'November 2025', eligibility: 'Graduate', type: 'Central', category: 'Business' },
    { name: 'MHT CET', authority: 'Maharashtra Govt', date: 'May 2025', eligibility: 'Class 12 (PCM/PCB)', type: 'State', category: 'Engineering' },
    { name: 'KCET', authority: 'Karnataka Govt', date: 'April 2025', eligibility: 'Class 12 pass', type: 'State', category: 'Engineering' },
    { name: 'AIIMS INI CET', authority: 'AIIMS', date: 'July 2025', eligibility: 'MBBS pass', type: 'Central', category: 'Medical' },
    { name: 'NIFT Entrance', authority: 'NIFT', date: 'February 2025', eligibility: 'Class 12 pass', type: 'Central', category: 'Design' },
    { name: 'GATE', authority: 'IIT', date: 'February 2026', eligibility: 'B.Tech/B.E.', type: 'Central', category: 'Engineering' },
    { name: 'VITEEE', authority: 'VIT', date: 'April 2025', eligibility: 'Class 12 (PCM)', type: 'Private', category: 'Engineering' },
];

const typeFilters = ['All', 'Central', 'State', 'Private'];
const categoryFilters = ['All', 'Engineering', 'Medical', 'Business', 'Law', 'Design', 'General'];

export default function EntranceExamScreen() {
    const [typeFilter, setTypeFilter] = useState('All');
    const [catFilter, setCatFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    let filtered = exams;
    if (typeFilter !== 'All') filtered = filtered.filter(e => e.type === typeFilter);
    if (catFilter !== 'All') filtered = filtered.filter(e => e.category === catFilter);

    return (
        <Screen>
            <SectionHeader title="Entrance Exams" subtitle="Practice tests and exam preparation guides." />

            <View className="px-6 py-3">
                <Pressable className={`self-start rounded-full border px-3 py-1.5 ${showFilters ? 'border-brand bg-brand' : 'border-line bg-surface'}`} onPress={() => setShowFilters(!showFilters)}>
                    <View className="flex-row items-center">
                        <Ionicons name="filter" size={16} color={showFilters ? palette.surface : palette.text} />
                        <Text className={`ml-1.5 text-[12px] font-semibold ${showFilters ? 'text-surface' : 'text-ink'}`}>Filters</Text>
                    </View>
                </Pressable>
            </View>

            {showFilters && (
                <View className="px-6 pb-3">
                    <Text className="mb-2 mt-2 text-[12px] font-bold uppercase text-muted">Exam Type</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {typeFilters.map(f => (
                            <Pressable key={f} className={`rounded-2xl border px-3 py-1.5 ${typeFilter === f ? 'border-brand bg-brand' : 'border-line bg-surface'}`} onPress={() => setTypeFilter(f)}>
                                <Text className={`text-[11px] font-semibold ${typeFilter === f ? 'text-surface' : 'text-ink'}`}>{f}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <Text className="mb-2 mt-2 text-[12px] font-bold uppercase text-muted">Category</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {categoryFilters.map(f => (
                            <Pressable key={f} className={`rounded-2xl border px-3 py-1.5 ${catFilter === f ? 'border-brand bg-brand' : 'border-line bg-surface'}`} onPress={() => setCatFilter(f)}>
                                <Text className={`text-[11px] font-semibold ${catFilter === f ? 'text-surface' : 'text-ink'}`}>{f}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}

            <ScrollView contentContainerClassName="px-6 pb-6" showsVerticalScrollIndicator={false}>
                {filtered.map((exam) => (
                    <View key={exam.name} className="mb-3 rounded-[12px] bg-card p-4 shadow-card">
                        <View className="flex-row items-start">
                            <View className="mr-3 h-10 w-10 items-center justify-center rounded-[10px]" style={{ backgroundColor: `${palette.primary}15` }}>
                                <Ionicons name="document-text-outline" size={20} color={palette.primary} />
                            </View>
                            <View className="flex-1">
                                <Text className="mb-0.5 text-[16px] font-bold text-ink">{exam.name}</Text>
                                <Text className="mb-1 text-[12px] text-muted">{exam.authority}</Text>
                                <View className="mb-0.5 flex-row items-center">
                                    <Ionicons name="calendar-outline" size={12} color={palette.muted} />
                                    <Text className="ml-1 text-[11px] text-muted">{exam.date}</Text>
                                </View>
                                <Text className="mb-1.5 text-[11px] text-muted">{exam.eligibility}</Text>
                                <View className="flex-row gap-1.5">
                                    <View className="rounded-[10px] px-2 py-0.5" style={{ backgroundColor: `${palette.blue}20` }}>
                                        <Text className="text-[9px] font-bold uppercase" style={{ color: palette.blue }}>{exam.type}</Text>
                                    </View>
                                    <View className="rounded-[10px] px-2 py-0.5" style={{ backgroundColor: `${palette.green}20` }}>
                                        <Text className="text-[9px] font-bold uppercase" style={{ color: palette.green }}>{exam.category}</Text>
                                    </View>
                                </View>
                            </View>
                            <Pressable className="h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${palette.primary}15` }}>
                                <Ionicons name="open-outline" size={16} color={palette.primary} />
                            </Pressable>
                        </View>
                    </View>
                ))}
                {filtered.length === 0 && (
                    <View className="items-center justify-center py-12">
                        <Text className="text-[14px] text-muted">No exams match your filters</Text>
                    </View>
                )}
            </ScrollView>
        </Screen>
    );
}

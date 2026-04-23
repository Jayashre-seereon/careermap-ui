import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { entranceExams, palette } from '../../src/careermap-data';
import { AnimatedPressable, Screen, SectionHeader } from '../../src/careermap-ui';
const typeFilters = ['All', 'Central', 'State', 'Private'];
const categoryFilters = ['All', 'Engineering', 'Medical', 'Business', 'Law', 'Design', 'General'];
export default function EntranceExamScreen() {
    const { preferences } = useAppState();
    const [typeFilter, setTypeFilter] = useState('All');
    const [catFilter, setCatFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    let filtered = entranceExams;
    if (typeFilter !== 'All')
        filtered = filtered.filter((e) => e.type === typeFilter);
    if (catFilter !== 'All')
        filtered = filtered.filter((e) => e.category === catFilter);
    return (<Screen>
            <SectionHeader title="Entrance Exams" subtitle="Practice tests and exam preparation guides." action={<AnimatedPressable className={`h-[40px] w-[40px] items-center justify-center rounded-[12px] ${showFilters ? 'bg-brand' : preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => setShowFilters((value) => !value)}>
                    <Ionicons name={showFilters ? 'options' : 'options-outline'} size={18} color={showFilters ? '#ffffff' : preferences.darkMode ? '#ffffff' : palette.text}/>
                </AnimatedPressable>}/>

            {showFilters && (<View className="gap-3">
                    <Text className={` text-[12px] font-bold uppercase ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Exam Type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-1">
                        {typeFilters.map((f) => (<AnimatedPressable key={f} className={`rounded-2xl border px-3 py-1.5 ${typeFilter === f ? 'border-brand bg-brand' : preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-surface'}`} onPress={() => setTypeFilter(f)}>
                                <Text className={`text-[11px] font-semibold ${typeFilter === f ? 'text-surface' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{f}</Text>
                            </AnimatedPressable>))}
                    </ScrollView>
                    <Text className={`text-[12px] font-bold uppercase ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-1">
                        {categoryFilters.map((f) => (<AnimatedPressable key={f} className={`rounded-2xl border px-3 py-1.5 ${catFilter === f ? 'border-brand bg-brand' : preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-surface'}`} onPress={() => setCatFilter(f)}>
                                <Text className={`text-[11px] font-semibold ${catFilter === f ? 'text-surface' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{f}</Text>
                            </AnimatedPressable>))}
                    </ScrollView>
                </View>)}

            <View className="gap-3">
                {filtered.map((exam) => (<AnimatedPressable key={exam.name} className={`mb-3 rounded-[12px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card shadow-card'}`} onPress={() => router.push({ pathname: '/(drawer)/entrance-exam-detail', params: { examId: exam.id } })}>
                        <View className="flex-row items-start">
                            <View className="mr-3 h-10 w-10 items-center justify-center rounded-[10px]" style={{ backgroundColor: `${palette.primary}15` }}>
                                <Ionicons name="document-text-outline" size={20} color={palette.primary}/>
                            </View>
                            <View className="flex-1">
                                <Text className={`mb-0.5 text-[16px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{exam.name}</Text>
                                <Text className={`mb-1 text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{exam.authority}</Text>
                                <View className="mb-0.5 flex-row items-center">
                                    <Ionicons name="calendar-outline" size={12} color={preferences.darkMode ? '#9f95a4' : palette.muted}/>
                                    <Text className={`ml-1 text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{exam.date}</Text>
                                </View>
                                <Text className={`mb-1.5 text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{exam.eligibility}</Text>
                                <View className="flex-row gap-1.5">
                                    <View className="rounded-[10px] px-2 py-0.5" style={{ backgroundColor: `${palette.blue}20` }}>
                                        <Text className="text-[9px] font-bold uppercase" style={{ color: palette.blue }}>{exam.type}</Text>
                                    </View>
                                    <View className="rounded-[10px] px-2 py-0.5" style={{ backgroundColor: `${palette.green}20` }}>
                                        <Text className="text-[9px] font-bold uppercase" style={{ color: palette.green }}>{exam.category}</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${palette.primary}15` }}>
                                <Ionicons name="open-outline" size={16} color={palette.primary}/>
                            </View>
                        </View>
                    </AnimatedPressable>))}
                {filtered.length === 0 && (<View className="items-center justify-center py-12">
                        <Text className={`text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No exams match your filters</Text>
                    </View>)}
            </View>
        </Screen>);
}

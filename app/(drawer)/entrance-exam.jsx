import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';
import { getEntranceExams } from '../../src/api/entranceExamApi';
import { AnimatedPressable, Screen, SectionHeader } from '../../src/careermap-ui';

export default function EntranceExamScreen() {
    const { preferences } = useAppState();
    const [entranceExams, setEntranceExams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [catFilter, setCatFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadEntranceExams() {
            try {
                setIsLoading(true);
                setLoadError('');
                const items = await getEntranceExams();

                if (isMounted) {
                    setEntranceExams(items);
                }
            } catch (_error) {
                if (isMounted) {
                    setEntranceExams([]);
                    setLoadError('Failed to load entrance exams.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadEntranceExams();

        return () => {
            isMounted = false;
        };
    }, []);

    const typeFilters = useMemo(
        () => ['All', ...Array.from(new Set(entranceExams.map((exam) => exam.type).filter(Boolean)))],
        [entranceExams]
    );
    const categoryFilters = useMemo(
        () => ['All', ...Array.from(new Set(entranceExams.map((exam) => exam.category).filter(Boolean)))],
        [entranceExams]
    );

    let filtered = [...entranceExams];

    if (typeFilter !== 'All') {
        filtered = filtered.filter((exam) => exam.type === typeFilter);
    }

    if (catFilter !== 'All') {
        filtered = filtered.filter((exam) => exam.category === catFilter);
    }

    return (
        <Screen>
            <SectionHeader
                title="Entrance Exams"
                subtitle="Practice tests and exam preparation guides."
                action={
                    <AnimatedPressable className={`h-[40px] w-[40px] items-center justify-center rounded-[12px] ${showFilters ? 'bg-brand' : preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => setShowFilters((value) => !value)}>
                        <Ionicons name={showFilters ? 'options' : 'options-outline'} size={18} color={showFilters ? '#ffffff' : preferences.darkMode ? '#ffffff' : palette.text}/>
                    </AnimatedPressable>
                }
            />

            {showFilters && (
                <View className="gap-3">
                    <Text className={` text-[12px] font-bold uppercase ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Exam Type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-1">
                        {typeFilters.map((filterValue) => (
                            <AnimatedPressable key={filterValue} className={`rounded-2xl border px-3 py-1.5 ${typeFilter === filterValue ? 'border-brand bg-brand' : preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-surface'}`} onPress={() => setTypeFilter(filterValue)}>
                                <Text className={`text-[11px] font-semibold ${typeFilter === filterValue ? 'text-surface' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{filterValue}</Text>
                            </AnimatedPressable>
                        ))}
                    </ScrollView>
                    <Text className={`text-[12px] font-bold uppercase ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-1">
                        {categoryFilters.map((filterValue) => (
                            <AnimatedPressable key={filterValue} className={`rounded-2xl border px-3 py-1.5 ${catFilter === filterValue ? 'border-brand bg-brand' : preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-surface'}`} onPress={() => setCatFilter(filterValue)}>
                                <Text className={`text-[11px] font-semibold ${catFilter === filterValue ? 'text-surface' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{filterValue}</Text>
                            </AnimatedPressable>
                        ))}
                    </ScrollView>
                </View>
            )}

            <View className="gap-3">
                {isLoading ? <Text className={`text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading entrance exams...</Text> : null}
                {!isLoading && loadError ? <Text className="text-[14px] text-brand">{loadError}</Text> : null}
                {filtered.map((exam) => (
                    <AnimatedPressable key={exam.id} className={`mb-3 rounded-[12px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card shadow-card'}`} onPress={() => router.push({ pathname: '/(drawer)/entrance-exam-detail', params: { examId: exam.id } })}>
                        <View className="flex-row items-start">
                            <View className="mr-3 h-10 w-10 items-center justify-center rounded-[10px]" style={{ backgroundColor: `${palette.primary}15` }}>
                                <Ionicons name="document-text-outline" size={20} color={palette.primary}/>
                            </View>
                            <View className="flex-1 pr-3">
                                <Text className={`mb-0.5 text-[16px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{exam.name}</Text>
                                <Text className={`mb-1 text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{exam.authority}</Text>
                                <View className="mb-0.5 flex-row items-center">
                                    <Ionicons name="calendar-outline" size={12} color={preferences.darkMode ? '#9f95a4' : palette.muted}/>
                                    <Text className={`ml-1 text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{exam.date}</Text>
                                </View>
                                <Text className={`mb-1.5 text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{exam.eligibility}</Text>
                            </View>
                            <View className="items-end gap-2">
                                <View className="h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${palette.primary}15` }}>
                                    <Ionicons name="open-outline" size={16} color={palette.primary}/>
                                </View>
                                <View className="rounded-[10px] px-2 py-1" style={{ backgroundColor: `${palette.orange}20` }}>
                                    <Text className="text-[9px] font-bold uppercase" style={{ color: palette.orange }}>Issue: {exam.issueDate}</Text>
                                </View>
                                <View className="rounded-[10px] px-2 py-1" style={{ backgroundColor: `${palette.green}20` }}>
                                    <Text className="text-[9px] font-bold uppercase" style={{ color: palette.green }}>Last: {exam.lastDate}</Text>
                                </View>
                            </View>
                        </View>
                    </AnimatedPressable>
                ))}
                {!isLoading && !loadError && filtered.length === 0 ? (
                    <View className="items-center justify-center py-12">
                        <Text className={`text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No exams match your filters</Text>
                    </View>
                ) : null}
            </View>
        </Screen>
    );
}

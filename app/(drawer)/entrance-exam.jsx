import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View,Linking } from 'react-native';
import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';
import { getEntranceExams } from '../../src/api/entranceExamApi';
import { checkModuleAccess, getModules } from '../../src/api/moduleAccessApi';
import { AnimatedPressable, HierarchyFilterPanel, Screen, SectionHeader, UnlockBottomSheet } from '../../src/careermap-ui';
import { buildHierarchyOptions, filterByHierarchy } from '../../src/utils/hierarchy';
import { openSubscriptionPrompt } from '../../src/subscription-flow';

export default function EntranceExamScreen() {
    const { preferences } = useAppState();
    const [entranceExams, setEntranceExams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [hasFullAccess, setHasFullAccess] = useState(false);
    const [moduleAccessResolved, setModuleAccessResolved] = useState(false);
    const [showUnlockSheet, setShowUnlockSheet] = useState(false);
    const [typeFilter, setTypeFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [secondCategoryFilter, setSecondCategoryFilter] = useState('All');
    const [subCategoryFilter, setSubCategoryFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadEntranceExams() {
            try {
                setIsLoading(true);
                setLoadError('');
                const items = await getEntranceExams();
                if (isMounted) setEntranceExams(items);
            } catch (_error) {
                if (isMounted) {
                    setEntranceExams([]);
                    setLoadError('Failed to load entrance exams.');
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadEntranceExams();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function loadModuleAccess() {
            try {
                let moduleId = null;
                const modules = await getModules();
                const matchedModule = modules.find((module) => String(module?.title || '').trim().toLowerCase().includes('entrance exam'));
                moduleId = Number(matchedModule?.id);

                if (!Number.isFinite(moduleId)) {
                    if (isMounted) {
                        setHasFullAccess(true);
                        setModuleAccessResolved(true);
                    }
                    return;
                }

                const response = await checkModuleAccess(moduleId);
                if (!isMounted) {
                    return;
                }

                setHasFullAccess(String(response?.mode || '').toLowerCase() === 'full' && response?.allowed !== false);
                setModuleAccessResolved(true);
            } catch (_error) {
                if (isMounted) {
                    setHasFullAccess(true);
                    setModuleAccessResolved(true);
                }
            }
        }

        loadModuleAccess();

        return () => {
            isMounted = false;
        };
    }, []);

    const typeFilters = useMemo(
        () => ['All', ...Array.from(new Set(entranceExams.map((exam) => exam.type).filter(Boolean)))],
        [entranceExams]
    );

    const hierarchyCategoryOptions = useMemo(
        () => buildHierarchyOptions(entranceExams, 'category', { secondcategory: secondCategoryFilter, subcategory: subCategoryFilter }),
        [entranceExams, secondCategoryFilter, subCategoryFilter]
    );
    const hierarchySecondCategoryOptions = useMemo(
        () => buildHierarchyOptions(entranceExams, 'secondcategory', { category: categoryFilter, subcategory: subCategoryFilter }),
        [entranceExams, categoryFilter, subCategoryFilter]
    );
    const hierarchySubCategoryOptions = useMemo(
        () => buildHierarchyOptions(entranceExams, 'subcategory', { category: categoryFilter, secondcategory: secondCategoryFilter }),
        [entranceExams, categoryFilter, secondCategoryFilter]
    );

    const filtered = useMemo(() => {
        let source = [...entranceExams];
        if (typeFilter !== 'All') source = source.filter((exam) => exam.type === typeFilter);
        return filterByHierarchy(source, {
            category: categoryFilter,
            secondcategory: secondCategoryFilter,
            subcategory: subCategoryFilter,
        });
    }, [categoryFilter, entranceExams, secondCategoryFilter, subCategoryFilter, typeFilter]);

    useEffect(() => {
        if (categoryFilter !== 'All' && !hierarchyCategoryOptions.some((option) => String(option?.value ?? option?.id ?? option?.label ?? option) === String(categoryFilter))) {
            setCategoryFilter('All');
        }
        if (!hierarchySecondCategoryOptions.some((option) => String(option?.value ?? option?.id ?? option?.label ?? option) === String(secondCategoryFilter))) {
            setSecondCategoryFilter('All');
        }
        if (!hierarchySubCategoryOptions.some((option) => String(option?.value ?? option?.id ?? option?.label ?? option) === String(subCategoryFilter))) {
            setSubCategoryFilter('All');
        }
    }, [categoryFilter, hierarchyCategoryOptions, hierarchySecondCategoryOptions, hierarchySubCategoryOptions, secondCategoryFilter, subCategoryFilter]);

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
                    <HierarchyFilterPanel
                        visible
                        categoryOptions={hierarchyCategoryOptions}
                        secondCategoryOptions={hierarchySecondCategoryOptions}
                        subCategoryOptions={hierarchySubCategoryOptions}
                        selectedCategory={categoryFilter}
                        selectedSecondCategory={secondCategoryFilter}
                        selectedSubCategory={subCategoryFilter}
                        onChangeCategory={(value) => {
                            setCategoryFilter(value);
                            setSecondCategoryFilter('All');
                            setSubCategoryFilter('All');
                        }}
                        onChangeSecondCategory={(value) => {
                            setSecondCategoryFilter(value);
                            setSubCategoryFilter('All');
                        }}
                        onChangeSubCategory={setSubCategoryFilter}
                    />
                </View>
            )}

            <View className="gap-3">
                {isLoading ? <Text className={`text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading entrance exams...</Text> : null}
                {!isLoading && loadError ? <Text className="text-[14px] text-brand">{loadError}</Text> : null}

                {!moduleAccessResolved ? <Text className={`text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Checking access...</Text> : null}

                {filtered.map((exam, index) => {
                    const cardUnlocked = hasFullAccess || index < 4;
                    return (
                    <AnimatedPressable
                        key={exam.id}
                        className={`mb-3 rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card shadow-card'}`}
                        onPress={() => {
                            if (!cardUnlocked) {
                                setShowUnlockSheet(true);
                                return;
                            }
                            if (exam.website && exam.website !== '#') {
                                Linking.openURL(exam.website);
                            }
                        }}
                    >
                       <View className="flex-row items-center gap-3">

                            {/* Document Icon */}
                           <View className="h-10 w-10 items-center justify-center rounded-[10px] shrink-0 mt-1" style={{ backgroundColor: `${palette.primary}15` }}>
                                <Ionicons name="document-text-outline" size={20} color={palette.primary}/>
                            </View>

                            {/* Title + Dates + Button in column */}
                            <View className="flex-1 gap-2">

                                <View className="flex-row items-start justify-between gap-3">
                                    <Text className={`flex-1 text-[15px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                                        {exam.name}
                                    </Text>
                                    {!cardUnlocked ? (
                                        <View className="h-6 w-6 items-center justify-center rounded-full bg-[#fdecea]">
                                            <Ionicons name="lock-closed" size={13} color="#e53935"/>
                                        </View>
                                    ) : (
                                        <View className="h-6 w-6 items-center justify-center rounded-full bg-[#e4f7ed]">
                                            <Ionicons name="lock-open" size={13} color="#2f9367"/>
                                        </View>
                                    )}
                                </View>

                              
                            </View>

                        </View>
                          {/* Dates and Button in one row */}
                               <View className="flex-row items-center gap-2 pt-3">

                                    {/* Issue Date */}
                                    <View className="rounded-[10px] px-2 py-1" style={{ backgroundColor: `${palette.orange}20` }}>
                                        <Text className="text-[9px] font-bold uppercase" style={{ color: palette.orange }}>
                                            Issue: {exam.issueDate}
                                        </Text>
                                    </View>

                                    {/* Last Date */}
                                    <View className="rounded-[10px] px-2 py-1" style={{ backgroundColor: `${palette.green}20` }}>
                                        <Text className="text-[9px] font-bold uppercase" style={{ color: palette.green }}>
                                            Last: {exam.lastDate}
                                        </Text>
                                    </View>

                                    {/* Visit Website Button */}
                                    <AnimatedPressable
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            if (!cardUnlocked) {
                                                setShowUnlockSheet(true);
                                                return;
                                            }
                                            if (exam.website) Linking.openURL(exam.website);
                                        }}
                                        className="px-8 "
                                    >
                                        <Text className="text-[10px] font-bold text-brand">
                                            Visit Website
                                        </Text>
                                    </AnimatedPressable>

                                </View>
                    </AnimatedPressable>
                );})}

                {!isLoading && !loadError && filtered.length === 0 ? (
                    <View className="items-center justify-center py-12">
                        <Text className={`text-[14px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No exams match your filters</Text>
                    </View>
                ) : null}
            </View>
            {showUnlockSheet ? (
                <UnlockBottomSheet
                    title="Unlock Entrance Exams"
                    subtitle="Subscribe to view more exam cards and open locked website links."
                    onClose={() => setShowUnlockSheet(false)}
                    onPress={() => {
                        setShowUnlockSheet(false);
                        openSubscriptionPrompt({ pathname: '/(drawer)/entrance-exam' });
                    }}
                />
            ) : null}
        </Screen>
    );
}

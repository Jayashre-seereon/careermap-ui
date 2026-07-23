import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View, Linking, TextInput, Pressable } from 'react-native';
import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';
import { getEntranceExams } from '../../src/api/entranceExamApi';
import { checkModuleAccess, getModules } from '../../src/api/moduleAccessApi';
import { AnimatedPressable, Screen, SectionHeader, UnlockBottomSheet } from '../../src/careermap-ui';
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
const [examSearchQuery, setExamSearchQuery] = useState('');
const [showExamDropdown, setShowExamDropdown] = useState(false);
const [selectedExamId, setSelectedExamId] = useState('');
const [categorySearchQuery, setCategorySearchQuery] = useState('');
const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
const [secondCategorySearchQuery, setSecondCategorySearchQuery] = useState('');
const [showSecondCategoryDropdown, setShowSecondCategoryDropdown] = useState(false);
const [subCategorySearchQuery, setSubCategorySearchQuery] = useState('');
const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
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
function getOptionValue(option) {
    return String(option?.value ?? option?.id ?? option?.label ?? option ?? '');
}
function getOptionLabel(option) {
    return String(option?.label ?? option?.title ?? option?.name ?? option ?? '');
}
   const searchableExams = useMemo(() => {
    const query = examSearchQuery.trim().toLowerCase();
    if (!query) return entranceExams;
    return entranceExams.filter((exam) => String(exam.name || '').toLowerCase().includes(query));
}, [entranceExams, examSearchQuery]);
const searchableCategoryOptions = useMemo(() => {
    const query = categorySearchQuery.trim().toLowerCase();
    if (!query) return hierarchyCategoryOptions;
    return hierarchyCategoryOptions.filter((opt) => getOptionLabel(opt).toLowerCase().includes(query));
}, [hierarchyCategoryOptions, categorySearchQuery]);

const searchableSecondCategoryOptions = useMemo(() => {
    const query = secondCategorySearchQuery.trim().toLowerCase();
    if (!query) return hierarchySecondCategoryOptions;
    return hierarchySecondCategoryOptions.filter((opt) => getOptionLabel(opt).toLowerCase().includes(query));
}, [hierarchySecondCategoryOptions, secondCategorySearchQuery]);

const searchableSubCategoryOptions = useMemo(() => {
    const query = subCategorySearchQuery.trim().toLowerCase();
    if (!query) return hierarchySubCategoryOptions;
    return hierarchySubCategoryOptions.filter((opt) => getOptionLabel(opt).toLowerCase().includes(query));
}, [hierarchySubCategoryOptions, subCategorySearchQuery]);
const filtered = useMemo(() => {
    let source = [...entranceExams];
    if (typeFilter !== 'All') source = source.filter((exam) => exam.type === typeFilter);
    if (selectedExamId) source = source.filter((exam) => String(exam.id) === String(selectedExamId));
    return filterByHierarchy(source, {
        category: categoryFilter,
        secondcategory: secondCategoryFilter,
        subcategory: subCategoryFilter,
    });
}, [categoryFilter, entranceExams, secondCategoryFilter, selectedExamId, subCategoryFilter, typeFilter]);
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
        <View className="relative z-10">
            <Pressable
                onPress={() => setShowExamDropdown((value) => !value)}
                className={`flex-row items-center justify-between rounded-[14px] border px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
            >
                <Text
                    numberOfLines={1}
                    className={`flex-1 text-[13px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}
                >
                    {selectedExamId
                        ? entranceExams.find((exam) => String(exam.id) === String(selectedExamId))?.name || 'Search Exam'
                        : 'Search Exam'}
                </Text>
                <Ionicons
                    name={showExamDropdown ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={preferences.darkMode ? '#ffffff' : palette.text}
                />
            </Pressable>

            {showExamDropdown ? (
                <View
                    className={`mt-2 max-h-[280px] rounded-[14px] border ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-white'}`}
                >
                    <View className="p-2">
                        <TextInput
                            value={examSearchQuery}
                            onChangeText={setExamSearchQuery}
                            placeholder="Type to search..."
                            placeholderTextColor={preferences.darkMode ? '#666666' : '#a89a94'}
                            autoFocus
                            className={`rounded-[10px] border px-3 py-2 text-[13px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111] text-white' : 'border-line bg-[#f2ebe6] text-ink'}`}
                        />
                    </View>

                    <ScrollView className="max-h-[220px]" keyboardShouldPersistTaps="handled">
                        {selectedExamId ? (
                            <Pressable
                                onPress={() => {
                                    setSelectedExamId('');
                                    setExamSearchQuery('');
                                    setShowExamDropdown(false);
                                }}
                                className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}
                            >
                                <Text className="text-[13px] font-bold text-brand">Clear Selection</Text>
                            </Pressable>
                        ) : null}

                        {searchableExams.length === 0 ? (
                            <Text className={`px-4 py-4 text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                                No exams found
                            </Text>
                        ) : (
                            searchableExams.map((exam) => (
                                <Pressable
                                    key={exam.id}
                                    onPress={() => {
                                        setSelectedExamId(exam.id);
                                        setExamSearchQuery('');
                                        setShowExamDropdown(false);
                                    }}
                                    className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}
                                >
                                    <Text
                                        numberOfLines={1}
                                        className={`text-[13px] font-semibold ${
                                            String(exam.id) === String(selectedExamId)
                                                ? 'text-brand'
                                                : preferences.darkMode
                                                ? 'text-white'
                                                : 'text-ink'
                                        }`}
                                    >
                                        {exam.name}
                                    </Text>
                                </Pressable>
                            ))
                        )}
                    </ScrollView>
                </View>
            ) : null}
        </View>

       <View className="relative z-10">
    <Pressable
        onPress={() => setShowCategoryDropdown((value) => !value)}
        className={`flex-row items-center justify-between rounded-[14px] border px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
    >
        <Text numberOfLines={1} className={`flex-1 text-[13px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
            {categoryFilter !== 'All'
                ? getOptionLabel(hierarchyCategoryOptions.find((opt) => getOptionValue(opt) === String(categoryFilter))) || 'All Categories'
                : 'All Categories'}
        </Text>
        <Ionicons name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'} size={16} color={preferences.darkMode ? '#ffffff' : palette.text} />
    </Pressable>

    {showCategoryDropdown ? (
        <View className={`mt-2 max-h-[280px] rounded-[14px] border ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-white'}`}>
            <View className="p-2">
                <TextInput
                    value={categorySearchQuery}
                    onChangeText={setCategorySearchQuery}
                    placeholder="Type to search..."
                    placeholderTextColor={preferences.darkMode ? '#666666' : '#a89a94'}
                    autoFocus
                    className={`rounded-[10px] border px-3 py-2 text-[13px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111] text-white' : 'border-line bg-[#f2ebe6] text-ink'}`}
                />
            </View>
            <ScrollView className="max-h-[220px]" keyboardShouldPersistTaps="handled">
                {categoryFilter !== 'All' ? (
                    <Pressable
                        onPress={() => {
                            setCategoryFilter('All');
                            setSecondCategoryFilter('All');
                            setSubCategoryFilter('All');
                            setCategorySearchQuery('');
                            setShowCategoryDropdown(false);
                        }}
                        className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}
                    >
                        <Text className="text-[13px] font-bold text-brand">All Categories</Text>
                    </Pressable>
                ) : null}
                {searchableCategoryOptions.length === 0 ? (
                    <Text className={`px-4 py-4 text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No categories found</Text>
                ) : (
                    searchableCategoryOptions.map((opt) => {
                        const value = getOptionValue(opt);
                        return (
                            <Pressable
                                key={value}
                                onPress={() => {
                                    setCategoryFilter(value);
                                    setSecondCategoryFilter('All');
                                    setSubCategoryFilter('All');
                                    setCategorySearchQuery('');
                                    setShowCategoryDropdown(false);
                                }}
                                className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}
                            >
                                <Text numberOfLines={1} className={`text-[13px] font-semibold ${value === String(categoryFilter) ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                                    {getOptionLabel(opt)}
                                </Text>
                            </Pressable>
                        );
                    })
                )}
            </ScrollView>
        </View>
    ) : null}
</View>

<View className="relative z-10">
    <Pressable
        onPress={() => setShowSecondCategoryDropdown((value) => !value)}
        className={`flex-row items-center justify-between rounded-[14px] border px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
    >
        <Text numberOfLines={1} className={`flex-1 text-[13px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
            {secondCategoryFilter !== 'All'
                ? getOptionLabel(hierarchySecondCategoryOptions.find((opt) => getOptionValue(opt) === String(secondCategoryFilter))) || 'All Second Categories'
                : 'All Second Categories'}
        </Text>
        <Ionicons name={showSecondCategoryDropdown ? 'chevron-up' : 'chevron-down'} size={16} color={preferences.darkMode ? '#ffffff' : palette.text} />
    </Pressable>

    {showSecondCategoryDropdown ? (
        <View className={`mt-2 max-h-[280px] rounded-[14px] border ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-white'}`}>
            <View className="p-2">
                <TextInput
                    value={secondCategorySearchQuery}
                    onChangeText={setSecondCategorySearchQuery}
                    placeholder="Type to search..."
                    placeholderTextColor={preferences.darkMode ? '#666666' : '#a89a94'}
                    autoFocus
                    className={`rounded-[10px] border px-3 py-2 text-[13px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111] text-white' : 'border-line bg-[#f2ebe6] text-ink'}`}
                />
            </View>
            <ScrollView className="max-h-[220px]" keyboardShouldPersistTaps="handled">
                {secondCategoryFilter !== 'All' ? (
                    <Pressable
                        onPress={() => {
                            setSecondCategoryFilter('All');
                            setSubCategoryFilter('All');
                            setSecondCategorySearchQuery('');
                            setShowSecondCategoryDropdown(false);
                        }}
                        className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}
                    >
                        <Text className="text-[13px] font-bold text-brand">All Second Categories</Text>
                    </Pressable>
                ) : null}
                {searchableSecondCategoryOptions.length === 0 ? (
                    <Text className={`px-4 py-4 text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No results found</Text>
                ) : (
                    searchableSecondCategoryOptions.map((opt) => {
                        const value = getOptionValue(opt);
                        return (
                            <Pressable
                                key={value}
                                onPress={() => {
                                    setSecondCategoryFilter(value);
                                    setSubCategoryFilter('All');
                                    setSecondCategorySearchQuery('');
                                    setShowSecondCategoryDropdown(false);
                                }}
                                className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}
                            >
                                <Text numberOfLines={1} className={`text-[13px] font-semibold ${value === String(secondCategoryFilter) ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                                    {getOptionLabel(opt)}
                                </Text>
                            </Pressable>
                        );
                    })
                )}
            </ScrollView>
        </View>
        
    ) : null}
    
</View>

<View className="relative z-10">
    <Pressable
        onPress={() => setShowSubCategoryDropdown((value) => !value)}
        className={`flex-row items-center justify-between rounded-[14px] border px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
    >
        <Text numberOfLines={1} className={`flex-1 text-[13px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
            {subCategoryFilter !== 'All'
                ? getOptionLabel(hierarchySubCategoryOptions.find((opt) => getOptionValue(opt) === String(subCategoryFilter))) || 'All Sub Categories'
                : 'All Sub Categories'}
        </Text>
        <Ionicons name={showSubCategoryDropdown ? 'chevron-up' : 'chevron-down'} size={16} color={preferences.darkMode ? '#ffffff' : palette.text} />
    </Pressable>

    {showSubCategoryDropdown ? (
        <View className={`mt-2 max-h-[280px] rounded-[14px] border ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-white'}`}>
            <View className="p-2">
                <TextInput
                    value={subCategorySearchQuery}
                    onChangeText={setSubCategorySearchQuery}
                    placeholder="Type to search..."
                    placeholderTextColor={preferences.darkMode ? '#666666' : '#a89a94'}
                    autoFocus
                    className={`rounded-[10px] border px-3 py-2 text-[13px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111] text-white' : 'border-line bg-[#f2ebe6] text-ink'}`}
                />
            </View>
            <ScrollView className="max-h-[220px]" keyboardShouldPersistTaps="handled">
                {subCategoryFilter !== 'All' ? (
                    <Pressable
                        onPress={() => {
                            setSubCategoryFilter('All');
                            setSubCategorySearchQuery('');
                            setShowSubCategoryDropdown(false);
                        }}
                        className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}
                    >
                        <Text className="text-[13px] font-bold text-brand">All Sub Categories</Text>
                    </Pressable>
                ) : null}
                {searchableSubCategoryOptions.length === 0 ? (
                    <Text className={`px-4 py-4 text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No results found</Text>
                ) : (
                    searchableSubCategoryOptions.map((opt) => {
                        const value = getOptionValue(opt);
                        return (
                            <Pressable
                                key={value}
                                onPress={() => {
                                    setSubCategoryFilter(value);
                                    setSubCategorySearchQuery('');
                                    setShowSubCategoryDropdown(false);
                                }}
                                className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}
                            >
                                <Text numberOfLines={1} className={`text-[13px] font-semibold ${value === String(subCategoryFilter) ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                                    {getOptionLabel(opt)}
                                </Text>
                            </Pressable>
                        );
                    })
                )}
        </ScrollView>
        </View>
    ) : null}
</View>

{(typeFilter !== 'All' || categoryFilter !== 'All' || secondCategoryFilter !== 'All' || subCategoryFilter !== 'All' || selectedExamId) ? (
    <Pressable
        onPress={() => {
            setTypeFilter('All');
            setCategoryFilter('All');
            setSecondCategoryFilter('All');
            setSubCategoryFilter('All');
            setSelectedExamId('');
            setExamSearchQuery('');
            setCategorySearchQuery('');
            setSecondCategorySearchQuery('');
            setSubCategorySearchQuery('');
            setShowExamDropdown(false);
            setShowCategoryDropdown(false);
            setShowSecondCategoryDropdown(false);
            setShowSubCategoryDropdown(false);
        }}
        className={`items-center rounded-[14px] border px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-[#fdf0ee]'}`}
    >
        <Text className="text-[13px] font-bold text-brand">Clear All Filters</Text>
    </Pressable>
) : null}
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

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Image, Linking, ScrollView, Text, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';
import { getInstitutes } from '../../src/api/instituteApi';
import { AnimatedPressable, HierarchyFilterPanel, Pill, Screen, SectionHeader } from '../../src/careermap-ui';
import { buildHierarchyOptions, filterByHierarchy } from '../../src/utils/hierarchy';

const getInstituteInitials = (name) => {
    const source = String(name || 'Institute').trim();
    const initials = source
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

    return initials || 'I';
};

const renderInstituteLogo = (item, size = 52) => {
    if (item?.logo) {
        return (<Image source={{ uri: item.logo }} resizeMode="cover" style={{
                width: size,
                height: size,
                borderRadius: 16,
            }}/>);
    }

    return (<View className="items-center justify-center" style={{
            width: size,
            height: size,
            borderRadius: 16,
            backgroundColor: `${palette.blue}14`,
            borderWidth: 1,
            borderColor: `${palette.blue}18`,
        }}>
      <Text className="text-[16px] font-black" style={{ color: palette.blue, lineHeight: 20 }}>
        {getInstituteInitials(item?.name)}
      </Text>
    </View>);
};

export default function InstituteScreen() {
    const { preferences } = useAppState();
    const [institutes, setInstitutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [typeFilter, setTypeFilter] = useState('All');
    const [stateFilter, setStateFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [secondCategoryFilter, setSecondCategoryFilter] = useState('All');
    const [subCategoryFilter, setSubCategoryFilter] = useState('All');
    const [sortAZ, setSortAZ] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadInstitutes() {
            try {
                setIsLoading(true);
                setLoadError('');
                const items = await getInstitutes();

                if (isMounted) {
                    setInstitutes(items);
                }
            } catch (_error) {
                if (isMounted) {
                    setInstitutes([]);
                    setLoadError('Failed to load institutes.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadInstitutes();

        return () => {
            isMounted = false;
        };
    }, []);

    const typeOptions = useMemo(
        () => ['All', ...Array.from(new Set(institutes.map((item) => item.type).filter(Boolean)))],
        [institutes]
    );
    const stateOptions = useMemo(
        () => ['All', ...Array.from(new Set(institutes.map((item) => item.state).filter(Boolean)))],
        [institutes]
    );
    const categoryOptions = useMemo(
        () => buildHierarchyOptions(institutes, 'category', { secondcategory: secondCategoryFilter, subcategory: subCategoryFilter }),
        [institutes, secondCategoryFilter, subCategoryFilter]
    );
    const secondCategoryOptions = useMemo(
        () => buildHierarchyOptions(institutes, 'secondcategory', { category: categoryFilter, subcategory: subCategoryFilter }),
        [institutes, categoryFilter, subCategoryFilter]
    );
    const subCategoryOptions = useMemo(
        () => buildHierarchyOptions(institutes, 'subcategory', { category: categoryFilter, secondcategory: secondCategoryFilter }),
        [institutes, categoryFilter, secondCategoryFilter]
    );

    const animationKey = selectedIndex !== null
        ? `institute-${selectedIndex}`
        : `institute-list-${typeFilter}-${stateFilter}-${sortAZ ? 'az' : 'default'}-${showFilters ? 'filters' : 'plain'}`;

    const filtered = useMemo(() => {
        let source = [...institutes];

        if (typeFilter !== 'All') {
            source = source.filter((item) => item.type === typeFilter);
        }

        if (stateFilter !== 'All') {
            source = source.filter((item) => item.state === stateFilter);
        }

        source = filterByHierarchy(source, {
            category: categoryFilter,
            secondcategory: secondCategoryFilter,
            subcategory: subCategoryFilter,
        });

        if (sortAZ) {
            source.sort((a, b) => a.name.localeCompare(b.name));
        }

        return source;
    }, [categoryFilter, institutes, secondCategoryFilter, sortAZ, stateFilter, subCategoryFilter, typeFilter]);

    useEffect(() => {
        if (categoryFilter !== 'All' && !categoryOptions.some((option) => String(option?.value ?? option?.id ?? option?.label ?? option) === String(categoryFilter))) {
            setCategoryFilter('All');
        }
        if (!secondCategoryOptions.some((option) => String(option?.value ?? option?.id ?? option?.label ?? option) === String(secondCategoryFilter))) {
            setSecondCategoryFilter('All');
        }
        if (!subCategoryOptions.some((option) => String(option?.value ?? option?.id ?? option?.label ?? option) === String(subCategoryFilter))) {
            setSubCategoryFilter('All');
        }
    }, [categoryFilter, categoryOptions, secondCategoryFilter, secondCategoryOptions, subCategoryFilter, subCategoryOptions]);

    if (selectedIndex !== null) {
        const item = filtered[selectedIndex];

        return (
            <Screen animationKey={animationKey}>
                <SectionHeader
                    title={item.name}
                    subtitle="Institute detail view shaped to match the reference prototype."
                    action={
                        <AnimatedPressable
                            className={`h-[38px] w-[38px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`}
                            onPress={() => setSelectedIndex(null)}
                        >
                            <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
                        </AnimatedPressable>
                    }
                />

                <View className="items-center gap-2 py-2">
                    <View className="h-[68px] w-[68px] overflow-hidden rounded-[22px]" style={{ backgroundColor: `${palette.primary}12` }}>
                        {renderInstituteLogo(item, 68)}
                    </View>
                    <Text className={`text-center text-[22px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.name}</Text>
                    <Text className={`text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.location}</Text>
                    <View className="flex-row justify-center">
                        <Pill label={item.type} tone={palette.blue}/>
                    </View>
                </View>

                <View className={`gap-2.5 rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
                    <Text className="text-[14px] font-extrabold text-brand">About</Text>
                    <Text className={`text-[13px] leading-[21px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.about}</Text>
                </View>

                <View className={`gap-2.5 rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}>
                    <Text className="text-[14px] font-extrabold text-brand">Courses Offered</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {item.courses.length
                            ? item.courses.map((course) => (
                                <View key={course} className={`rounded-[12px] px-3 py-2 ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f7f2fb]'}`}>
                                    <Text className="text-[12px] font-bold text-purple-700" style={{ color: palette.purple }}>{course}</Text>
                                </View>
                            ))
                            : (
                                <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                                    Course information is not available right now.
                                </Text>
                            )}
                    </View>
                </View>

                <AnimatedPressable
                    className="items-center rounded-[16px] bg-brand py-[14px]"
                    onPress={() => {
                        if (item.website && item.website !== '#') {
                            Linking.openURL(item.website);
                        }
                    }}
                >
                    <Text className="text-[14px] font-extrabold text-white">Visit Official Website</Text>
                </AnimatedPressable>
            </Screen>
        );
    }

    return (
        <Screen animationKey={animationKey}>
            <SectionHeader
                title="Institutes"
                subtitle="Institute directory with filters and detail cards based on the reference prototype."
                action={
                    <View className="flex-row gap-2">
                        <AnimatedPressable
                            className={`h-[40px] w-[40px] items-center justify-center rounded-[12px] ${showFilters ? 'bg-brand' : preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`}
                            onPress={() => setShowFilters((value) => !value)}
                        >
                            <Ionicons name={showFilters ? 'options' : 'options-outline'} size={18} color={showFilters ? '#ffffff' : preferences.darkMode ? '#ffffff' : palette.text}/>
                        </AnimatedPressable>
                        <AnimatedPressable
                            className={`rounded-[12px] px-2.5 py-2 ${sortAZ ? 'bg-brand' : preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`}
                            onPress={() => setSortAZ((value) => !value)}
                        >
                            <Text className={`text-[11px] font-extrabold ${sortAZ ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>A-Z</Text>
                        </AnimatedPressable>
                    </View>
                }
            />

            {showFilters ? (
                <View className="gap-2.5">
                    <Text className={`text-[11px] font-extrabold uppercase tracking-[0.7px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Institute Type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2.5 pr-1">
                        {typeOptions.map((label) => (
                            <AnimatedPressable key={label} className={`rounded-full px-3 py-2 ${typeFilter === label ? 'bg-brand' : preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => setTypeFilter(label)}>
                                <Text className={`text-[11px] font-extrabold ${typeFilter === label ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{label}</Text>
                            </AnimatedPressable>
                        ))}
                    </ScrollView>
                    <Text className={`text-[11px] font-extrabold uppercase tracking-[0.7px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>State</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2.5 pr-1">
                        {stateOptions.map((label) => (
                            <AnimatedPressable key={label} className={`rounded-full px-3 py-2 ${stateFilter === label ? 'bg-brand' : preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => setStateFilter(label)}>
                                <Text className={`text-[11px] font-extrabold ${stateFilter === label ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{label}</Text>
                            </AnimatedPressable>
                        ))}
                    </ScrollView>
                    <HierarchyFilterPanel
                        visible
                        categoryOptions={categoryOptions}
                        secondCategoryOptions={secondCategoryOptions}
                        subCategoryOptions={subCategoryOptions}
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
            ) : null}

            <View className="gap-3">
                {isLoading ? <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading institutes...</Text> : null}
                {!isLoading && loadError ? <Text className="text-[13px] text-brand">{loadError}</Text> : null}
                {!isLoading && !loadError && filtered.length === 0 ? (
                    <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No institutes available right now.</Text>
                ) : null}

                {filtered.map((item, index) => (
                    <AnimatedPressable key={item.id} className={`relative gap-3 rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} onPress={() => setSelectedIndex(index)}>
                        <View className="absolute right-4 top-4">
                            <Pill label={item.type} tone={palette.blue}/>
                        </View>
                        <View className="flex-row gap-3">
                            <View className="h-[50px] w-[50px] overflow-hidden rounded-[16px]" style={{ backgroundColor: `${palette.primary}12` }}>
                                {renderInstituteLogo(item, 50)}
                            </View>
                            <View className="flex-1 gap-1 pr-[96px]">
                                <Text numberOfLines={2} className={`text-[15px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.name}</Text>
                                <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.location}</Text>
                            </View>
                        </View>
                    </AnimatedPressable>
                ))}
            </View>
        </Screen>
    );
}

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';
import { getInstitutes } from '../../src/api/instituteApi';
import { checkModuleAccess, getModules } from '../../src/api/moduleAccessApi';
import { AnimatedPressable, HierarchyFilterPanel, Pill, Screen, SectionHeader ,} from '../../src/careermap-ui';
import { buildHierarchyOptions, filterByHierarchy } from '../../src/utils/hierarchy';
import { UnlockBottomSheet } from '../../src/careermap-ui';

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
    const params = useLocalSearchParams();
    const { preferences } = useAppState();
    const [institutes, setInstitutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [hasFullAccess, setHasFullAccess] = useState(false);
    const [moduleAccessResolved, setModuleAccessResolved] = useState(false);
    const [showUnlockSheet, setShowUnlockSheet] = useState(false);
      const [showFilters, setShowFilters] = useState(false);
const [typeFilter, setTypeFilter] = useState('All');
const [countryFilter, setCountryFilter] = useState('All');
const [stateFilter, setStateFilter] = useState('All');
const [categoryFilter, setCategoryFilter] = useState('All');
const [secondCategoryFilter, setSecondCategoryFilter] = useState('All');
const [subCategoryFilter, setSubCategoryFilter] = useState('All');
const [sortAZ, setSortAZ] = useState(false);

const [showTypeDropdown, setShowTypeDropdown] = useState(false);
const [typeSearchQuery, setTypeSearchQuery] = useState('');
const [showCountryDropdown, setShowCountryDropdown] = useState(false);
const [countrySearchQuery, setCountrySearchQuery] = useState('');
const [showStateDropdown, setShowStateDropdown] = useState(false);
const [stateSearchQuery, setStateSearchQuery] = useState('');
const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
const [categorySearchQuery, setCategorySearchQuery] = useState('');
const [showSecondCategoryDropdown, setShowSecondCategoryDropdown] = useState(false);
const [secondCategorySearchQuery, setSecondCategorySearchQuery] = useState('');
const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
const [subCategorySearchQuery, setSubCategorySearchQuery] = useState('');
    const resolvedModuleId = useMemo(() => {
        const parsed = Number(params.moduleId);
        return Number.isFinite(parsed) ? parsed : null;
    }, [params.moduleId]);

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
    useEffect(() => {
        let isMounted = true;
        const resolveModuleAccess = async () => {
            try {
                let moduleId = resolvedModuleId;
                if (!Number.isFinite(moduleId)) {
                    const modules = await getModules();
                    const matched = modules.find((module) => String(module?.title || '').trim().toLowerCase().includes('institute'));
                    moduleId = Number(matched?.id);
                }
                if (!Number.isFinite(moduleId)) {
                    if (isMounted) {
                        setHasFullAccess(true);
                        setModuleAccessResolved(true);
                    }
                    return;
                }
                const response = await checkModuleAccess(moduleId);
                if (!isMounted) return;
                setHasFullAccess(String(response?.mode || '').toLowerCase() === 'full');
                setModuleAccessResolved(true);
            }
            catch {
                if (isMounted) {
                    setHasFullAccess(true);
                    setModuleAccessResolved(true);
                }
            }
        };
        resolveModuleAccess();
        return () => {
            isMounted = false;
        };
    }, [resolvedModuleId]);
const countryOptions = useMemo(
    () => ['All', ...Array.from(new Set(institutes.map((item) => item.country).filter(Boolean)))],
    [institutes]
);
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

function getOptionValue(option) {
    return String(option?.value ?? option?.id ?? option?.label ?? option ?? '');
}
function getOptionLabel(option) {
    return String(option?.label ?? option?.title ?? option?.name ?? option ?? '');
}

const searchableTypeOptions = useMemo(() => {
    const query = typeSearchQuery.trim().toLowerCase();
    const source = typeOptions.filter((o) => o !== 'All');
    if (!query) return source;
    return source.filter((o) => String(o).toLowerCase().includes(query));
}, [typeOptions, typeSearchQuery]);

const searchableCountryOptions = useMemo(() => {
    const query = countrySearchQuery.trim().toLowerCase();
    const source = countryOptions.filter((o) => o !== 'All');
    if (!query) return source;
    return source.filter((o) => String(o).toLowerCase().includes(query));
}, [countryOptions, countrySearchQuery]);

const searchableStateOptions = useMemo(() => {
    const query = stateSearchQuery.trim().toLowerCase();
    const source = stateOptions.filter((o) => o !== 'All');
    if (!query) return source;
    return source.filter((o) => String(o).toLowerCase().includes(query));
}, [stateOptions, stateSearchQuery]);

const searchableCategoryOptions = useMemo(() => {
    const query = categorySearchQuery.trim().toLowerCase();
    if (!query) return categoryOptions;
    return categoryOptions.filter((opt) => getOptionLabel(opt).toLowerCase().includes(query));
}, [categoryOptions, categorySearchQuery]);

const searchableSecondCategoryOptions = useMemo(() => {
    const query = secondCategorySearchQuery.trim().toLowerCase();
    if (!query) return secondCategoryOptions;
    return secondCategoryOptions.filter((opt) => getOptionLabel(opt).toLowerCase().includes(query));
}, [secondCategoryOptions, secondCategorySearchQuery]);

const searchableSubCategoryOptions = useMemo(() => {
    const query = subCategorySearchQuery.trim().toLowerCase();
    if (!query) return subCategoryOptions;
    return subCategoryOptions.filter((opt) => getOptionLabel(opt).toLowerCase().includes(query));
}, [subCategoryOptions, subCategorySearchQuery]);
const animationKey = `institute-list-${typeFilter}-${stateFilter}-${sortAZ ? 'az' : 'default'}-${showFilters ? 'filters' : 'plain'}`;
   
    const filtered = useMemo(() => {
        let source = [...institutes];

        if (countryFilter !== 'All') {
    source = source.filter((item) => item.country === countryFilter);
}

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
    }, [categoryFilter, institutes, secondCategoryFilter, sortAZ,countryFilter, stateFilter, subCategoryFilter, typeFilter]);

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

   const DropdownFilter = ({ label, value, options, onChange }) => {
  return (
    <View className="gap-1">
      <Text className="text-[11px] font-semibold text-muted">{label}</Text>

      <View className="rounded-[14px] border border-line bg-white px-3 py-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-[13px] outline-none"
        >
          <option value="All">All</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </View>
    </View>
  );
};

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
                      
                    </View>
                }
            />

          {showFilters ? (
    <View className="gap-3">
        {[
            { key: 'type', label: 'All Types', value: typeFilter, show: showTypeDropdown, setShow: setShowTypeDropdown, query: typeSearchQuery, setQuery: setTypeSearchQuery, options: searchableTypeOptions, onSelect: (v) => { setTypeFilter(v); setTypeSearchQuery(''); setShowTypeDropdown(false); }, onClear: () => { setTypeFilter('All'); setTypeSearchQuery(''); setShowTypeDropdown(false); } },
        ].map(() => null)}

        {/* Type */}
        <View className="relative z-30">
            <Pressable
                onPress={() => setShowTypeDropdown((value) => !value)}
                className={`flex-row items-center justify-between rounded-[14px] border px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
            >
                <Text numberOfLines={1} className={`flex-1 text-[13px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                    {typeFilter !== 'All' ? typeFilter : 'All Types'}
                </Text>
                <Ionicons name={showTypeDropdown ? 'chevron-up' : 'chevron-down'} size={16} color={preferences.darkMode ? '#ffffff' : palette.text} />
            </Pressable>
            {showTypeDropdown ? (
                <View className={`mt-2 max-h-[280px] rounded-[14px] border ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-white'}`}>
                    <View className="p-2">
                        <TextInput
                            value={typeSearchQuery}
                            onChangeText={setTypeSearchQuery}
                            placeholder="Type to search..."
                            placeholderTextColor={preferences.darkMode ? '#666666' : '#a89a94'}
                            autoFocus
                            className={`rounded-[10px] border px-3 py-2 text-[13px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111] text-white' : 'border-line bg-[#f2ebe6] text-ink'}`}
                        />
                    </View>
                    <ScrollView className="max-h-[220px]" keyboardShouldPersistTaps="handled">
                        {typeFilter !== 'All' ? (
                            <Pressable onPress={() => { setTypeFilter('All'); setTypeSearchQuery(''); setShowTypeDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                <Text className="text-[13px] font-bold text-brand">All Types</Text>
                            </Pressable>
                        ) : null}
                        {searchableTypeOptions.length === 0 ? (
                            <Text className={`px-4 py-4 text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No results found</Text>
                        ) : (
                            searchableTypeOptions.map((opt) => (
                                <Pressable key={opt} onPress={() => { setTypeFilter(opt); setTypeSearchQuery(''); setShowTypeDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                    <Text numberOfLines={1} className={`text-[13px] font-semibold ${opt === typeFilter ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{opt}</Text>
                                </Pressable>
                            ))
                        )}
                    </ScrollView>
                </View>
            ) : null}
        </View>

        {/* State */}
        <View className="relative z-20">
            <Pressable
                onPress={() => setShowStateDropdown((value) => !value)}
                className={`flex-row items-center justify-between rounded-[14px] border px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
            >
                <Text numberOfLines={1} className={`flex-1 text-[13px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                    {stateFilter !== 'All' ? stateFilter : 'All States'}
                </Text>
                <Ionicons name={showStateDropdown ? 'chevron-up' : 'chevron-down'} size={16} color={preferences.darkMode ? '#ffffff' : palette.text} />
            </Pressable>
            {showStateDropdown ? (
                <View className={`mt-2 max-h-[280px] rounded-[14px] border ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-white'}`}>
                    <View className="p-2">
                        <TextInput
                            value={stateSearchQuery}
                            onChangeText={setStateSearchQuery}
                            placeholder="Type to search..."
                            placeholderTextColor={preferences.darkMode ? '#666666' : '#a89a94'}
                            autoFocus
                            className={`rounded-[10px] border px-3 py-2 text-[13px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111] text-white' : 'border-line bg-[#f2ebe6] text-ink'}`}
                        />
                    </View>
                    <ScrollView className="max-h-[220px]" keyboardShouldPersistTaps="handled">
                        {stateFilter !== 'All' ? (
                            <Pressable onPress={() => { setStateFilter('All'); setStateSearchQuery(''); setShowStateDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                <Text className="text-[13px] font-bold text-brand">All States</Text>
                            </Pressable>
                        ) : null}
                        {searchableStateOptions.length === 0 ? (
                            <Text className={`px-4 py-4 text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No results found</Text>
                        ) : (
                            searchableStateOptions.map((opt) => (
                                <Pressable key={opt} onPress={() => { setStateFilter(opt); setStateSearchQuery(''); setShowStateDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                    <Text numberOfLines={1} className={`text-[13px] font-semibold ${opt === stateFilter ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{opt}</Text>
                                </Pressable>
                            ))
                        )}
                    </ScrollView>
                </View>
            ) : null}
        </View>

        {/* Country */}
        <View className="relative z-10">
            <Pressable
                onPress={() => setShowCountryDropdown((value) => !value)}
                className={`flex-row items-center justify-between rounded-[14px] border px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
            >
                <Text numberOfLines={1} className={`flex-1 text-[13px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                    {countryFilter !== 'All' ? countryFilter : 'All Countries'}
                </Text>
                <Ionicons name={showCountryDropdown ? 'chevron-up' : 'chevron-down'} size={16} color={preferences.darkMode ? '#ffffff' : palette.text} />
            </Pressable>
            {showCountryDropdown ? (
                <View className={`mt-2 max-h-[280px] rounded-[14px] border ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-white'}`}>
                    <View className="p-2">
                        <TextInput
                            value={countrySearchQuery}
                            onChangeText={setCountrySearchQuery}
                            placeholder="Type to search..."
                            placeholderTextColor={preferences.darkMode ? '#666666' : '#a89a94'}
                            autoFocus
                            className={`rounded-[10px] border px-3 py-2 text-[13px] ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#111111] text-white' : 'border-line bg-[#f2ebe6] text-ink'}`}
                        />
                    </View>
                    <ScrollView className="max-h-[220px]" keyboardShouldPersistTaps="handled">
                        {countryFilter !== 'All' ? (
                            <Pressable onPress={() => { setCountryFilter('All'); setCountrySearchQuery(''); setShowCountryDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                <Text className="text-[13px] font-bold text-brand">All Countries</Text>
                            </Pressable>
                        ) : null}
                        {searchableCountryOptions.length === 0 ? (
                            <Text className={`px-4 py-4 text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No results found</Text>
                        ) : (
                            searchableCountryOptions.map((opt) => (
                                <Pressable key={opt} onPress={() => { setCountryFilter(opt); setCountrySearchQuery(''); setShowCountryDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                    <Text numberOfLines={1} className={`text-[13px] font-semibold ${opt === countryFilter ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{opt}</Text>
                                </Pressable>
                            ))
                        )}
                    </ScrollView>
                </View>
            ) : null}
        </View>

        {/* Category */}
        <View className="relative z-10">
            <Pressable
                onPress={() => setShowCategoryDropdown((value) => !value)}
                className={`flex-row items-center justify-between rounded-[14px] border px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
            >
                <Text numberOfLines={1} className={`flex-1 text-[13px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                    {categoryFilter !== 'All'
                        ? getOptionLabel(categoryOptions.find((opt) => getOptionValue(opt) === String(categoryFilter))) || 'All Categories'
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
                            <Pressable onPress={() => { setCategoryFilter('All'); setSecondCategoryFilter('All'); setSubCategoryFilter('All'); setCategorySearchQuery(''); setShowCategoryDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                <Text className="text-[13px] font-bold text-brand">All Categories</Text>
                            </Pressable>
                        ) : null}
                        {searchableCategoryOptions.length === 0 ? (
                            <Text className={`px-4 py-4 text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No categories found</Text>
                        ) : (
                            searchableCategoryOptions.map((opt) => {
                                const value = getOptionValue(opt);
                                return (
                                    <Pressable key={value} onPress={() => { setCategoryFilter(value); setSecondCategoryFilter('All'); setSubCategoryFilter('All'); setCategorySearchQuery(''); setShowCategoryDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                        <Text numberOfLines={1} className={`text-[13px] font-semibold ${value === String(categoryFilter) ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{getOptionLabel(opt)}</Text>
                                    </Pressable>
                                );
                            })
                        )}
                    </ScrollView>
                </View>
            ) : null}
        </View>

        {/* Second Category */}
        <View className="relative z-10">
            <Pressable
                onPress={() => setShowSecondCategoryDropdown((value) => !value)}
                className={`flex-row items-center justify-between rounded-[14px] border px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
            >
                <Text numberOfLines={1} className={`flex-1 text-[13px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                    {secondCategoryFilter !== 'All'
                        ? getOptionLabel(secondCategoryOptions.find((opt) => getOptionValue(opt) === String(secondCategoryFilter))) || 'All Second Categories'
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
                            <Pressable onPress={() => { setSecondCategoryFilter('All'); setSubCategoryFilter('All'); setSecondCategorySearchQuery(''); setShowSecondCategoryDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                <Text className="text-[13px] font-bold text-brand">All Second Categories</Text>
                            </Pressable>
                        ) : null}
                        {searchableSecondCategoryOptions.length === 0 ? (
                            <Text className={`px-4 py-4 text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No results found</Text>
                        ) : (
                            searchableSecondCategoryOptions.map((opt) => {
                                const value = getOptionValue(opt);
                                return (
                                    <Pressable key={value} onPress={() => { setSecondCategoryFilter(value); setSubCategoryFilter('All'); setSecondCategorySearchQuery(''); setShowSecondCategoryDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                        <Text numberOfLines={1} className={`text-[13px] font-semibold ${value === String(secondCategoryFilter) ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{getOptionLabel(opt)}</Text>
                                    </Pressable>
                                );
                            })
                        )}
                    </ScrollView>
                </View>
            ) : null}
        </View>

        {/* Sub Category */}
        <View className="relative z-10">
            <Pressable
                onPress={() => setShowSubCategoryDropdown((value) => !value)}
                className={`flex-row items-center justify-between rounded-[14px] border px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
            >
                <Text numberOfLines={1} className={`flex-1 text-[13px] font-semibold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                    {subCategoryFilter !== 'All'
                        ? getOptionLabel(subCategoryOptions.find((opt) => getOptionValue(opt) === String(subCategoryFilter))) || 'All Sub Categories'
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
                            <Pressable onPress={() => { setSubCategoryFilter('All'); setSubCategorySearchQuery(''); setShowSubCategoryDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                <Text className="text-[13px] font-bold text-brand">All Sub Categories</Text>
                            </Pressable>
                        ) : null}
                        {searchableSubCategoryOptions.length === 0 ? (
                            <Text className={`px-4 py-4 text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No results found</Text>
                        ) : (
                            searchableSubCategoryOptions.map((opt) => {
                                const value = getOptionValue(opt);
                                return (
                                    <Pressable key={value} onPress={() => { setSubCategoryFilter(value); setSubCategorySearchQuery(''); setShowSubCategoryDropdown(false); }} className={`border-b px-4 py-3 ${preferences.darkMode ? 'border-[#1a1a1a]' : 'border-line'}`}>
                                        <Text numberOfLines={1} className={`text-[13px] font-semibold ${value === String(subCategoryFilter) ? 'text-brand' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{getOptionLabel(opt)}</Text>
                                    </Pressable>
                                );
                            })
                        )}
                    </ScrollView>
                </View>
            ) : null}
        </View>

        {(typeFilter !== 'All' || stateFilter !== 'All' || countryFilter !== 'All' || categoryFilter !== 'All' || secondCategoryFilter !== 'All' || subCategoryFilter !== 'All') ? (
            <Pressable
                onPress={() => {
                    setTypeFilter('All');
                    setStateFilter('All');
                    setCountryFilter('All');
                    setCategoryFilter('All');
                    setSecondCategoryFilter('All');
                    setSubCategoryFilter('All');
                    setTypeSearchQuery('');
                    setStateSearchQuery('');
                    setCountrySearchQuery('');
                    setCategorySearchQuery('');
                    setSecondCategorySearchQuery('');
                    setSubCategorySearchQuery('');
                    setShowTypeDropdown(false);
                    setShowStateDropdown(false);
                    setShowCountryDropdown(false);
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
) : null}

            <View className="gap-3">
                {!moduleAccessResolved ? <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Checking access...</Text> : null}
                {isLoading ? <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading institutes...</Text> : null}
                {!isLoading && loadError ? <Text className="text-[13px] text-brand">{loadError}</Text> : null}
                {!isLoading && !loadError && filtered.length === 0 ? (
                    <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No institutes available right now.</Text>
                ) : null}

             {filtered.map((item, index) => {
    const cardUnlocked = hasFullAccess || index < 4;
    return (
    <AnimatedPressable 
        key={item.id} 
        className={`flex-row justify-between items-start rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
        onPress={() => {
            if (!cardUnlocked) {
                setShowUnlockSheet(true);
                return;
            }
            if (item.website && item.website !== '#') {
                Linking.openURL(item.website);
            }
        }}
    >
        {/* LEFT COLUMN: Logo & Text details */}
        <View className="flex-1 flex-row gap-3 pr-2">
            <View className="h-[50px] w-[50px] overflow-hidden rounded-[16px]" style={{ backgroundColor: `${palette.primary}12` }}>
                {renderInstituteLogo(item, 50)}
            </View>
            <View className="flex-1 gap-1">
                <Text numberOfLines={2} className={`text-[15px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>
                    {item.name}
                </Text>
                <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                    {item.location}
                </Text>
            </View>
        </View>

        {/* RIGHT COLUMN: Stretched vertically to force button to the absolute bottom */}
        <View className="self-stretch justify-between items-end pl-2 min-h-[64px]">
           <View className="h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: `${cardUnlocked ? palette.green : '#e53935'}18` }}>
                <Ionicons name={cardUnlocked ? 'lock-open' : 'lock-closed'} size={13} color={cardUnlocked ? palette.green : '#e53935'}/>
            </View>
            
            <AnimatedPressable
                onPress={(e) => {
                    e.stopPropagation();
                    if (!cardUnlocked) {
                        setShowUnlockSheet(true);
                        return;
                    }
                    if (item.website && item.website !== '#') {
                        Linking.openURL(item.website);
                    }
                }}
                className="px-3 py-1.5  mt-4"
            >
                <Text className="text-[10px] font-bold text-brand">
                    Visit Website
                </Text>
            </AnimatedPressable>
        </View>

    </AnimatedPressable>
);})}
            </View>
            {showUnlockSheet ? (<UnlockBottomSheet title="Unlock Institutes" subtitle="Subscribe to more institute cards and links." onClose={() => setShowUnlockSheet(false)} onPress={() => setShowUnlockSheet(false)}/>) : null}
        </Screen>
    );
}

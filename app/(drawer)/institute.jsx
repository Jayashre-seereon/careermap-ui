import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Image, Linking, ScrollView, Text, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';
import { getInstitutes } from '../../src/api/instituteApi';
import { AnimatedPressable, HierarchyFilterPanel, Pill, Screen, SectionHeader ,} from '../../src/careermap-ui';
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
      const [showFilters, setShowFilters] = useState(false);
    const [typeFilter, setTypeFilter] = useState('All');
    const [countryFilter, setCountryFilter] = useState('All');
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
                <View className="gap-2.5">
                   <View className="flex-row gap-2">
  <View className="flex-1">
    <DropdownFilter
      label="Type"
      value={typeFilter}
      options={typeOptions.filter(o => o !== 'All')}
      onChange={setTypeFilter}
    />
  </View>

  <View className="flex-1">
    <DropdownFilter
      label="State"
      value={stateFilter}
      options={stateOptions.filter(o => o !== 'All')}
      onChange={setStateFilter}
    />
  </View>

  <View className="flex-1">
    <DropdownFilter
      label="Country"
      value={countryFilter}
      options={countryOptions.filter(o => o !== 'All')}
      onChange={setCountryFilter}
    />
  </View>
</View>
                    
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
    <AnimatedPressable 
        key={item.id} 
        className={`flex-row justify-between items-start rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`}
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
            <View>
                <Pill label={item.type} tone={palette.blue}/>
            </View>
            
            <AnimatedPressable
                onPress={(e) => {
                    e.stopPropagation();
                    Linking.openURL(item.website);
                }}
                className="px-3 py-1.5  mt-4"
            >
                <Text className="text-[10px] font-bold text-brand">
                    Visit Website
                </Text>
            </AnimatedPressable>
        </View>

    </AnimatedPressable>
))}
            </View>
        </Screen>
    );
}

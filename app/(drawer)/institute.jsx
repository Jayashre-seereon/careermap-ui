import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';
import { getInstitutes } from '../../src/api/instituteApi';
import { AnimatedPressable, Pill, Screen, SectionHeader } from '../../src/careermap-ui';

export default function InstituteScreen() {
    const { preferences } = useAppState();
    const [institutes, setInstitutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [typeFilter, setTypeFilter] = useState('All');
    const [stateFilter, setStateFilter] = useState('All');
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

    const animationKey = selectedIndex !== null
        ? `institute-${selectedIndex}`
        : `institute-list-${typeFilter}-${stateFilter}-${sortAZ ? 'az' : 'default'}-${showFilters ? 'filters' : 'plain'}`;

    let filtered = [...institutes];

    if (typeFilter !== 'All') {
        filtered = filtered.filter((item) => item.type === typeFilter);
    }

    if (stateFilter !== 'All') {
        filtered = filtered.filter((item) => item.state === stateFilter);
    }

    if (sortAZ) {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

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
                    <View className="h-[68px] w-[68px] items-center justify-center rounded-[22px]" style={{ backgroundColor: `${palette.primary}12` }}>
                        <Ionicons name={item.icon} size={28} color={palette.primary}/>
                    </View>
                    <Text className={`text-center text-[22px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.name}</Text>
                    <Text className={`text-center text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.location}</Text>
                    <View className="flex-row justify-center">
                        <Pill label={`${item.rank} ${item.type}`} tone={palette.primary}/>
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
                            <AnimatedPressable key={`state-${label}`} onPress={() => setStateFilter(label)} className={`rounded-full px-3 py-2 ${stateFilter === label ? 'bg-brand' : preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`}>
                                <Text className={`text-[11px] font-extrabold ${stateFilter === label ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{label}</Text>
                            </AnimatedPressable>
                        ))}
                    </ScrollView>
                </View>
            ) : null}

            <View className="gap-3">
                {isLoading ? <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Loading institutes...</Text> : null}
                {!isLoading && loadError ? <Text className="text-[13px] text-brand">{loadError}</Text> : null}
                {!isLoading && !loadError && filtered.length === 0 ? (
                    <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>No institutes available right now.</Text>
                ) : null}

                {filtered.map((item, index) => (
                    <AnimatedPressable key={item.id} className={`gap-3 rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} onPress={() => setSelectedIndex(index)}>
                        <View className="flex-row gap-3">
                            <View className="h-[50px] w-[50px] items-center justify-center rounded-[16px]" style={{ backgroundColor: `${palette.primary}12` }}>
                                <Ionicons name={item.icon} size={20} color={palette.primary}/>
                            </View>
                            <View className="flex-1 gap-1">
                                <Text className={`text-[15px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.name}</Text>
                                <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.location}</Text>
                                <View className="flex-row gap-2">
                                    <Pill label={item.type} tone={palette.blue}/>
                                    <Pill label={item.rank} tone={palette.primary}/>
                                </View>
                            </View>
                        </View>
                    </AnimatedPressable>
                ))}
            </View>
        </Screen>
    );
}

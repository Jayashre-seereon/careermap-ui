import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { institutes, palette } from '../../src/careermap-data';
import { AnimatedPressable, Pill, Screen, SectionHeader } from '../../src/careermap-ui';
export default function InstituteScreen() {
    const { preferences } = useAppState();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [typeFilter, setTypeFilter] = useState('All');
    const [careerFilter, setCareerFilter] = useState('All');
    const [sortAZ, setSortAZ] = useState(false);
    const animationKey = selectedIndex !== null ? `institute-${selectedIndex}` : `institute-list-${typeFilter}-${careerFilter}-${sortAZ ? 'az' : 'default'}-${showFilters ? 'filters' : 'plain'}`;
    let filtered = [...institutes];
    if (typeFilter !== 'All')
        filtered = filtered.filter((item) => item.type === typeFilter);
    if (careerFilter !== 'All')
        filtered = filtered.filter((item) => item.career === careerFilter);
    if (sortAZ)
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (selectedIndex !== null) {
        const item = filtered[selectedIndex];
        return (<Screen animationKey={animationKey}>
        <SectionHeader title={item.name} subtitle="Institute detail view shaped to match the reference prototype." action={<AnimatedPressable className={`h-[38px] w-[38px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => setSelectedIndex(null)}>
              <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
            </AnimatedPressable>}/>

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
            {item.courses.map((course) => (<View key={course} className={`rounded-[12px] px-3 py-2 ${preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f7f2fb]'}`}>
                <Text className="text-[12px] font-bold text-purple-700" style={{ color: palette.purple }}>{course}</Text>
              </View>))}
          </View>
        </View>

        <AnimatedPressable className="items-center rounded-[16px] bg-brand py-[14px]" onPress={() => Linking.openURL(item.website)}>
          <Text className="text-[14px] font-extrabold text-white">Visit Official Website</Text>
        </AnimatedPressable>
      </Screen>);
    }
    return (<Screen animationKey={animationKey}>
      <SectionHeader title="Institutes" subtitle="Institute directory with filters and detail cards based on the reference prototype." action={<View className="flex-row gap-2">
            <AnimatedPressable className={`h-[40px] w-[40px] items-center justify-center rounded-[12px] ${showFilters ? 'bg-brand' : preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => setShowFilters((value) => !value)}>
              <Ionicons name={showFilters ? 'options' : 'options-outline'} size={18} color={showFilters ? '#ffffff' : preferences.darkMode ? '#ffffff' : palette.text}/>
            </AnimatedPressable>
            <AnimatedPressable className={`rounded-[12px] px-2.5 py-2 ${sortAZ ? 'bg-brand' : preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => setSortAZ((value) => !value)}>
              <Text className={`text-[11px] font-extrabold ${sortAZ ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>A-Z</Text>
            </AnimatedPressable>
          </View>}/>

      {showFilters ? (<View className="gap-2.5">
          <Text className={`text-[11px] font-extrabold uppercase tracking-[0.7px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Institute Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2.5 pr-1">
            {['All', 'Engineering', 'Medical', 'Business', 'Design', 'Law'].map((label) => (<AnimatedPressable key={label} className={`rounded-full px-3 py-2 ${typeFilter === label ? 'bg-brand' : preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`} onPress={() => setTypeFilter(label)}>
                <Text className={`text-[11px] font-extrabold ${typeFilter === label ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{label}</Text>
              </AnimatedPressable>))}
          </ScrollView>

          <Text className={`text-[11px] font-extrabold uppercase tracking-[0.7px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Career</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2.5 pr-1">
            {['All', 'Engineering', 'Medical', 'Business', 'Design', 'Law'].map((label) => (<AnimatedPressable key={`career-${label}`} onPress={() => setCareerFilter(label)} className={`rounded-full px-3 py-2 ${careerFilter === label ? 'bg-brand' : preferences.darkMode ? 'bg-[#111111]' : 'bg-[#f2ebe6]'}`}>
                <Text className={`text-[11px] font-extrabold ${careerFilter === label ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{label}</Text>
              </AnimatedPressable>))}
          </ScrollView>
        </View>) : null}

      <View className="gap-3">
        {filtered.map((item, index) => (<AnimatedPressable key={item.name} className={`gap-3 rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#1a1a1a] bg-[#080808]' : 'border-line bg-card'}`} onPress={() => setSelectedIndex(index)}>
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
          </AnimatedPressable>))}
      </View>
    </Screen>);
}

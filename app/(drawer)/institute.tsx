import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { institutes, palette } from '../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../src/careermap-ui';

export default function InstituteScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [careerFilter, setCareerFilter] = useState('All');
  const [sortAZ, setSortAZ] = useState(false);

  let filtered = [...institutes];
  if (typeFilter !== 'All') filtered = filtered.filter((item) => item.type === typeFilter);
  if (careerFilter !== 'All') filtered = filtered.filter((item) => item.career === careerFilter);
  if (sortAZ) filtered.sort((a, b) => a.name.localeCompare(b.name));

  if (selectedIndex !== null) {
    const item = filtered[selectedIndex];

    return (
      <Screen>
        <SectionHeader
          title={item.name}
          subtitle="Institute detail view shaped to match the reference prototype."
          action={
            <Pressable className="h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-[#f2ebe6]" onPress={() => setSelectedIndex(null)}>
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />

        <View className="items-center gap-2 py-2">
          <View className="h-[68px] w-[68px] items-center justify-center rounded-[22px]" style={{ backgroundColor: `${palette.primary}12` }}>
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={28} color={palette.primary} />
          </View>
          <Text className="text-center text-[22px] font-black text-ink">{item.name}</Text>
          <Text className="text-center text-[13px] text-muted">{item.location}</Text>
          <View className="flex-row justify-center">
            <Pill label={`${item.rank} ${item.type}`} tone={palette.primary} />
          </View>
        </View>

        <View className="gap-2.5 rounded-[22px] border border-line bg-card p-4">
          <Text className="text-[14px] font-extrabold text-brand">About</Text>
          <Text className="text-[13px] leading-[21px] text-muted">{item.about}</Text>
        </View>

        <View className="gap-2.5 rounded-[22px] border border-line bg-card p-4">
          <Text className="text-[14px] font-extrabold text-brand">Courses Offered</Text>
          <View className="flex-row flex-wrap gap-2">
            {item.courses.map((course) => (
              <View key={course} className="rounded-[12px] bg-[#f7f2fb] px-3 py-2">
                <Text className="text-[12px] font-bold text-purple-700" style={{ color: palette.purple }}>{course}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable className="items-center rounded-[16px] py-[14px]" onPress={() => Linking.openURL(item.website)} style={{ backgroundColor: `${palette.primary}12` }}>
          <Text className="text-[14px] font-extrabold text-brand">Visit Official Website</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Institutes"
        subtitle="Institute directory with filters and detail cards based on the reference prototype."
        action={
          <View className="flex-row gap-2">
            <Pressable className={`rounded-[12px] px-2.5 py-2 ${showFilters ? 'bg-brand' : 'bg-[#f2ebe6]'}`} onPress={() => setShowFilters((value) => !value)}>
              <Text className={`text-[11px] font-extrabold ${showFilters ? 'text-white' : 'text-ink'}`}>Filter</Text>
            </Pressable>
            <Pressable className={`rounded-[12px] px-2.5 py-2 ${sortAZ ? 'bg-brand' : 'bg-[#f2ebe6]'}`} onPress={() => setSortAZ((value) => !value)}>
              <Text className={`text-[11px] font-extrabold ${sortAZ ? 'text-white' : 'text-ink'}`}>A-Z</Text>
            </Pressable>
          </View>
        }
      />

      {showFilters ? (
        <View className="gap-2.5">
          <Text className="text-[11px] font-extrabold uppercase tracking-[0.7px] text-muted">Institute Type</Text>
          <View className="flex-row flex-wrap gap-2.5">
            {['All', 'Engineering', 'Medical', 'Business', 'Design', 'Law'].map((label) => (
              <Pressable key={label} className={`rounded-full px-3 py-2 ${typeFilter === label ? 'bg-brand' : 'bg-[#f2ebe6]'}`} onPress={() => setTypeFilter(label)}>
                <Text className={`text-[11px] font-extrabold ${typeFilter === label ? 'text-white' : 'text-ink'}`}>{label}</Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-[11px] font-extrabold uppercase tracking-[0.7px] text-muted">Career</Text>
          <View className="flex-row flex-wrap gap-2.5">
            {['All', 'Engineering', 'Medical', 'Business', 'Design', 'Law'].map((label) => (
              <Pressable
                key={`career-${label}`}
                onPress={() => setCareerFilter(label)}
                className={`rounded-full px-3 py-2 ${careerFilter === label ? 'bg-brand' : 'bg-[#f2ebe6]'}`}
              >
                <Text className={`text-[11px] font-extrabold ${careerFilter === label ? 'text-white' : 'text-ink'}`}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View className="gap-3">
        {filtered.map((item, index) => (
          <Pressable key={item.name} className="gap-3 rounded-[22px] border border-line bg-card p-4" onPress={() => setSelectedIndex(index)}>
            <View className="flex-row gap-3">
              <View className="h-[50px] w-[50px] items-center justify-center rounded-[16px]" style={{ backgroundColor: `${palette.primary}12` }}>
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={palette.primary} />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-[15px] font-extrabold text-ink">{item.name}</Text>
                <Text className="text-[12px] text-muted">{item.location}</Text>
                <View className="flex-row gap-2">
                  <Pill label={item.type} tone={palette.blue} />
                  <Pill label={item.rank} tone={palette.primary} />
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

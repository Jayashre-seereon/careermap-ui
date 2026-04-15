import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { useAppState } from '../../../src/app-state';
import { masterClasses, palette } from '../../../src/careermap-data';
import { AnimatedPressable, Pill, Screen, SectionHeader } from '../../../src/careermap-ui';
export default function LearnScreen() {
    const { isUnlocked } = useAppState();
    const masterClassUnlocked = isUnlocked('master-class');
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [sortBy, setSortBy] = useState('popular');
    let filtered = activeFilter === 'All' ? [...masterClasses] : masterClasses.filter((item) => item.career === activeFilter);
    if (sortBy === 'popular' || sortBy === 'views')
        filtered.sort((a, b) => b.views - a.views);
    else if (sortBy === 'az')
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    else
        filtered.sort((a, b) => b.title.localeCompare(a.title));
    return (<Screen>
      <SectionHeader title="Master Class" subtitle="Learning videos and sorting adapted closely from the prototype master class screen." action={<AnimatedPressable className={`rounded-[12px] px-3 py-2 ${showFilters ? 'bg-brand' : 'bg-[#f2ebe6]'}`} onPress={() => setShowFilters((value) => !value)}>
            <Text className={`text-[12px] font-extrabold ${showFilters ? 'text-white' : 'text-ink'}`}>Filter</Text>
          </AnimatedPressable>}/>

      {showFilters ? (<View className="flex-row flex-wrap gap-2">
          {[
                { id: 'popular', label: 'Most Popular' },
                { id: 'views', label: 'Most Viewed' },
                { id: 'az', label: 'A-Z' },
                { id: 'za', label: 'Z-A' },
            ].map((item) => (<AnimatedPressable key={item.id} className={`rounded-full px-3 py-2 ${sortBy === item.id ? 'bg-brand' : 'bg-[#f2ebe6]'}`} onPress={() => setSortBy(item.id)}>
              <Text className={`text-[11px] font-extrabold ${sortBy === item.id ? 'text-white' : 'text-ink'}`}>{item.label}</Text>
            </AnimatedPressable>))}
        </View>) : null}

      <View className="flex-row flex-wrap gap-2.5">
        {['All', 'Engineering', 'Medical', 'Business', 'Technology', 'Design'].map((label) => (<AnimatedPressable key={label} className={`rounded-full px-[13px] py-2 ${activeFilter === label ? 'bg-brand' : 'bg-[#f2ebe6]'}`} onPress={() => setActiveFilter(label)}>
            <Text className={`text-[12px] font-extrabold ${activeFilter === label ? 'text-white' : 'text-ink'}`}>{label}</Text>
          </AnimatedPressable>))}
      </View>

      <View className="gap-3">
        {filtered.map((item) => (<View key={item.title} className="gap-[14px] rounded-[22px] border border-line bg-card p-4" style={{ opacity: item.locked ? 0.82 : 1 }}>
            <View className="flex-row items-start gap-3">
              <View className={`h-[58px] w-[58px] items-center justify-center rounded-[18px] ${item.locked ? 'bg-[#f2eff2]' : ''}`} style={item.locked ? undefined : { backgroundColor: `${palette.primary}12` }}>
                <Text className="text-[11px] font-extrabold text-brand-deep">{item.locked ? 'LOCK' : 'PLAY'}</Text>
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-[15px] font-extrabold leading-[21px] text-ink">{item.title}</Text>
                <Text className="text-[12px] text-muted">{item.mentor}</Text>
                <View className="flex-row items-center justify-between gap-2.5">
                  <View className="gap-0.5">
                    <Text className="text-[12px] font-bold text-muted">{item.duration}</Text>
                    <Text className="text-[11px] text-muted">{(item.views / 1000).toFixed(1)}k views</Text>
                  </View>
                  <Pill label={item.career} tone={palette.primary}/>
                </View>
              </View>
            </View>
            <AnimatedPressable onPress={() => item.locked && !masterClassUnlocked
                ? router.push('/subscription')
                : item.url !== '#'
                    ? Linking.openURL(item.url)
                    : undefined} className="rounded-[14px] py-[11px]" style={{ backgroundColor: item.locked && !masterClassUnlocked ? `${palette.primary}12` : '#fff8f1' }}>
              <Text className="text-center text-[13px] font-extrabold" style={{ color: item.locked && !masterClassUnlocked ? palette.primary : palette.primaryDeep }}>
                {item.locked && !masterClassUnlocked ? 'Subscribe to Watch' : 'Watch Video'}
              </Text>
            </AnimatedPressable>
          </View>))}
      </View>
    </Screen>);
}

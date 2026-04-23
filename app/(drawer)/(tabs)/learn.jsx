import { useMemo, useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../../../src/app-state';
import { masterClasses, palette } from '../../../src/careermap-data';
import { AnimatedPressable, Pill, Screen, SectionHeader, UnlockBottomSheet, mobileAssistantScrollProps } from '../../../src/careermap-ui';
import { openSubscriptionPrompt } from '../../../src/subscription-flow';
export default function LearnScreen() {
    const insets = useSafeAreaInsets();
    const { canAccessFreeDetail, isUnlocked, preferences, registerFreeDetailAccess } = useAppState();
    const masterClassUnlocked = isUnlocked('master-class');
    const [showFilters, setShowFilters] = useState(false);
    const [activeVideoType, setActiveVideoType] = useState('All');
    const [activeCareer, setActiveCareer] = useState('All');
    const [sortBy, setSortBy] = useState('popular');
    const [showUnlockSheet, setShowUnlockSheet] = useState(false);
    const careerOptions = useMemo(() => ['All', ...Array.from(new Set(masterClasses.map((item) => item.career)))], []);
    const videoTypeOptions = useMemo(() => ['All', 'Expert Videos', 'Career Videos'], []);
    let filtered = [...masterClasses];
    if (activeVideoType !== 'All') {
        filtered = filtered.filter((item) => item.videoType === activeVideoType);
    }
    if (activeCareer !== 'All') {
        filtered = filtered.filter((item) => item.career === activeCareer);
    }
    if (sortBy === 'popular' || sortBy === 'views')
        filtered.sort((a, b) => b.views - a.views);
    else if (sortBy === 'az')
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    else
        filtered.sort((a, b) => b.title.localeCompare(a.title));
    const subscriptionTarget = useMemo(() => ({
        pathname: '/(drawer)/(tabs)/learn',
    }), []);
    return (<Screen scroll={true}>
      <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="gap-[18px]  pt-2 " contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 72, 88) }} showsVerticalScrollIndicator={false} {...mobileAssistantScrollProps}>
      <SectionHeader title="Master Class" subtitle="Learning videos and sorting adapted closely from the prototype master class screen." action={<AnimatedPressable className={`h-[40px] w-[40px] items-center justify-center rounded-[12px] ${showFilters ? 'bg-brand' : preferences.darkMode ? 'bg-[#312636]' : 'bg-[#f2ebe6]'}`} onPress={() => setShowFilters((value) => !value)}>
            <Ionicons name={showFilters ? 'options' : 'options-outline'} size={18} color={showFilters ? '#ffffff' : preferences.darkMode ? '#ffffff' : palette.text}/>
          </AnimatedPressable>}/>
 <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-1">
            {videoTypeOptions.map((label) => (<AnimatedPressable key={label} className={`rounded-full px-[13px] py-2 ${activeVideoType === label ? 'bg-brand' : preferences.darkMode ? 'bg-[#312636]' : 'bg-[#f2ebe6]'}`} onPress={() => setActiveVideoType(label)}>
                <Text className={`text-[12px] font-extrabold ${activeVideoType === label ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{label}</Text>
              </AnimatedPressable>))}
          </ScrollView>
      {showFilters ? (<View className="gap-3">
         <Text className={` text-[12px] font-bold uppercase ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>short</Text>
                  
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-1">
            {[
                { id: 'popular', label: 'Most Popular' },
                { id: 'views', label: 'Most Viewed' },
                { id: 'az', label: 'A-Z' },
                { id: 'za', label: 'Z-A' },
            ].map((item) => (<AnimatedPressable key={item.id} className={`rounded-full px-3 py-2 ${sortBy === item.id ? 'bg-brand' : preferences.darkMode ? 'bg-[#312636]' : 'bg-[#f2ebe6]'}`} onPress={() => setSortBy(item.id)}>
              <Text className={`text-[11px] font-extrabold ${sortBy === item.id ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.label}</Text>
            </AnimatedPressable>))}
          </ScrollView>
         
           <Text className={`text-[12px] font-bold uppercase ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Career</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-1">
            {careerOptions.map((label) => (<AnimatedPressable key={label} className={`rounded-full px-[13px] py-2 ${activeCareer === label ? 'bg-brand' : preferences.darkMode ? 'bg-[#312636]' : 'bg-[#f2ebe6]'}`} onPress={() => setActiveCareer(label)}>
                <Text className={`text-[12px] font-extrabold ${activeCareer === label ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{label}</Text>
              </AnimatedPressable>))}
          </ScrollView>
        </View>) : null}

      <View className="gap-3">
        {filtered.map((item) => {
                const detailUnlocked = !item.locked || masterClassUnlocked || canAccessFreeDetail('master-class', item.title);
                return (<View key={item.title} className={`relative gap-[14px] rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`} style={{ opacity: item.locked && !detailUnlocked ? 0.96 : 1 }}>
            {item.locked && !masterClassUnlocked ? (<View className={`absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-full ${preferences.darkMode ? 'bg-[#2a1d26]' : 'bg-[#f8e8d8]'}`}>
                <Text className="text-[12px] font-black text-brand">{detailUnlocked ? '1' : 'L'}</Text>
              </View>) : null}
            <View className="flex-row items-start gap-3">
              <View className={`h-[58px] w-[58px] items-center justify-center rounded-[18px] ${item.locked ? preferences.darkMode ? 'bg-[#312636]' : 'bg-[#f2eff2]' : ''}`} style={item.locked ? undefined : { backgroundColor: `${palette.primary}12` }}>
                <Text className="text-[11px] font-extrabold text-brand-deep">{item.locked ? 'LOCK' : 'PLAY'}</Text>
              </View>
              <View className="flex-1 gap-1">
                <Text className={`text-[15px] font-extrabold leading-[21px] ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.title}</Text>
                <Text className={`text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.mentor}</Text>
                <View className="flex-row items-center justify-between gap-2.5">
                  <View className="gap-0.5">
                    <Text className={`text-[12px] font-bold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.duration}</Text>
                    <Text className={`text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{(item.views / 1000).toFixed(1)}k views</Text>
                  </View>
                  <Pill label={item.career} tone={palette.primary}/>
                </View>
              </View>
            </View>
            {!masterClassUnlocked && item.locked ? (<Text className={`text-[12px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
                {detailUnlocked ? 'Your first locked class is available for free.' : 'You have already used the free master class preview.'}
              </Text>) : null}
            <AnimatedPressable onPress={() => {
                    if (item.locked && !masterClassUnlocked && !detailUnlocked) {
                        setShowUnlockSheet(true);
                        return;
                    }
                    if (item.locked) {
                        registerFreeDetailAccess('master-class', item.title);
                    }
                    if (item.url !== '#') {
                        Linking.openURL(item.url);
                    }
                }} className={`rounded-[14px] py-[11px] ${item.locked && !masterClassUnlocked ? '' : 'bg-brand'}`} gradient={!(item.locked && !masterClassUnlocked)} style={item.locked && !masterClassUnlocked ? { backgroundColor: `${palette.primary}12` } : undefined}>
              <Text className="text-center text-[13px] font-extrabold" style={{ color: item.locked && !masterClassUnlocked ? palette.primary : '#ffffff' }}>
                {item.locked && !masterClassUnlocked ? detailUnlocked ? 'Watch 1 Free Class' : 'Unlock More Classes' : 'Watch Video'}
              </Text>
            </AnimatedPressable>
          </View>);
            })}
      </View>
      </ScrollView>
      {showUnlockSheet ? (<UnlockBottomSheet title="Unlock Master Class" subtitle="Subscribe to more classes and keep learning without limits." onClose={() => setShowUnlockSheet(false)} onPress={() => {
                setShowUnlockSheet(false);
                openSubscriptionPrompt(subscriptionTarget);
            }}/>) : null}
      </View>
    </Screen>);
}

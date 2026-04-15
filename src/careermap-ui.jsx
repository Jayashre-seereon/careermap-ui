import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from './app-state';
import { palette } from './careermap-data';
import { AnimatedBackground } from './animated-background';
import { ZoomInPage } from './page-transition';
export function Screen({ children }) {
    const { preferences } = useAppState();
    return (<SafeAreaView className={`flex-1 ${preferences.darkMode ? 'bg-[#140f17]' : 'bg-paper'}`} edges={['top']}>
      <AnimatedBackground />  {/* 👈 ADD THIS LINE */}
      <ZoomInPage style={{ flex: 1 }}>
        <ScrollView className="flex-1" contentContainerClassName="gap-[18px] px-5 py-5" showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </ZoomInPage>
    </SafeAreaView>);
}
export function SectionHeader({ title, subtitle, action }) {
    const { preferences } = useAppState();
    return (<View className="flex-row items-end justify-between gap-3">
      <View className="flex-1 gap-1">
        <Text className={`text-[18px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{title}</Text>
        {subtitle ? <Text className={`text-[13px] leading-[18px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>);
}
export function HeroCard({ eyebrow, title, description, }) {
    const { preferences } = useAppState();
    return (<View className={`gap-2.5 rounded-[28px] border p-[22px] shadow-card ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
      <Text className="text-[12px] font-bold uppercase tracking-[1px] text-brand">{eyebrow}</Text>
      <Text className={`text-[28px] font-black leading-[34px] ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{title}</Text>
      <Text className={`text-[14px] leading-[22px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{description}</Text>
    </View>);
}
export function Pill({ label, tone = palette.primary }) {
    return (<View className="self-start rounded-full px-3 py-[7px]" style={{ backgroundColor: `${tone}15` }}>
      <Text className="text-[12px] font-bold" style={{ color: tone }}>
        {label}
      </Text>
    </View>);
}
export function InfoCard({ icon, title, subtitle, onPress, }) {
    const { preferences } = useAppState();
    const content = (<View className={`min-h-[140px] min-w-[47%] flex-1 gap-2.5 rounded-[24px] border p-[18px] ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
      <View className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-[#f8ece7]'}`}>
        <Ionicons name={icon} size={20} color={palette.primary}/>
      </View>
      <Text className={`text-[16px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{title}</Text>
      <Text className={`text-[13px] leading-5 ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{subtitle}</Text>
    </View>);
    if (!onPress) {
        return content;
    }
    return <AnimatedPressable className="min-w-[47%] flex-1 rounded-[24px]" onPress={onPress}>{content}</AnimatedPressable>;
}
export function ListRow({ icon, title, value, onPress, }) {
    const { preferences } = useAppState();
    return (<AnimatedPressable className={`flex-row items-center justify-between gap-3 rounded-[20px] border px-4 py-[15px] ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`} onPress={onPress}>
      <View className="flex-1 flex-row items-center gap-3">
        <View className={`h-[34px] w-[34px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-[#f8ece7]'}`}>
          <Ionicons name={icon} size={18} color={palette.primary}/>
        </View>
        <Text className={`flex-1 text-[15px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{title}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value ? <Text className={`text-[12px] font-semibold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={18} color={palette.muted}/>
      </View>
    </AnimatedPressable>);
}
export function StatCard({ label, value, tone, }) {
    const { preferences } = useAppState();
    return (<View className={`flex-1 gap-2.5 rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
      <View className="h-[10px] w-[10px] rounded-full" style={{ backgroundColor: tone }}/>
      <Text className={`text-[24px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{value}</Text>
      <Text className={`text-[12px] font-semibold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{label}</Text>
    </View>);
}
export function AnimatedPressable({ children, onPress, className, disabled, style, }) {
    const scale = useRef(new Animated.Value(1)).current;
    const animateTo = (value) => {
        Animated.spring(scale, {
            toValue: value,
            useNativeDriver: true,
            speed: 28,
            bounciness: 4,
        }).start();
    };
    return (<Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable className={className} disabled={disabled} onPress={onPress} onPressIn={() => animateTo(0.97)} onPressOut={() => animateTo(1)} style={({ pressed }) => ({ opacity: disabled ? 0.5 : pressed ? 0.96 : 1 })}>
        {children}
      </Pressable>
    </Animated.View>);
}

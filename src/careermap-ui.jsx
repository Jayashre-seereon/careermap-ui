import { Ionicons } from '@expo/vector-icons';
import { Children, useRef } from 'react';
import { Animated, DeviceEventEmitter, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from './app-state';
import { AnimatedBackground } from './animated-background';
import { palette } from './careermap-data';
import { StaggerFadeUpItem, ZoomInPage } from './page-transition';

export const mobileAssistantScrollProps = {
    scrollEventThrottle: 16,
    onScrollBeginDrag: () => DeviceEventEmitter.emit('careermap:scroll-active'),
    onMomentumScrollBegin: () => DeviceEventEmitter.emit('careermap:scroll-active'),
    onScrollEndDrag: () => DeviceEventEmitter.emit('careermap:scroll-idle'),
    onMomentumScrollEnd: () => DeviceEventEmitter.emit('careermap:scroll-idle'),
};

export function Screen({ children, scroll = true, contentContainerClassName = 'gap-[18px] px-5 py-5', animationKey = 'default' }) {
    const { preferences } = useAppState();
    const insets = useSafeAreaInsets();
    const childArray = Children.toArray(children);
    const animatedChildren = childArray.map((child, index) => (<StaggerFadeUpItem key={index} index={index} style={!scroll && (childArray.length === 1 || index > 0) ? { flex: 1, minHeight: 0 } : undefined}>
      {child}
    </StaggerFadeUpItem>));
    const contentPaddingBottom = Math.max(insets.bottom + 120, 140);
    return (<SafeAreaView className={`flex-1 ${preferences.darkMode ? 'bg-[#050505]' : 'bg-paper'}`} edges={['top']}>
      <AnimatedBackground />
      <ZoomInPage key={animationKey} style={{ flex: 1 }}>
        {scroll ? (<ScrollView className="flex-1" contentContainerClassName={contentContainerClassName} contentContainerStyle={{ paddingBottom: contentPaddingBottom }} showsVerticalScrollIndicator={false} {...mobileAssistantScrollProps}>
            {animatedChildren}
          </ScrollView>) : (<View className={contentContainerClassName} style={{ flex: 1 }}>
            {animatedChildren}
          </View>)}
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
    return (<View className={`gap-2.5 rounded-[28px] border p-[22px] shadow-card ${preferences.darkMode ? 'border-[#35101b] bg-[#0f0f10]' : 'border-line bg-card'}`}>
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
    const content = (<View className={`min-h-[140px] min-w-[47%] flex-1 gap-2.5 rounded-[24px] border p-[18px] ${preferences.darkMode ? 'border-[#35101b] bg-[#0f0f10]' : 'border-line bg-card'}`}>
      <View className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#1b1014]' : 'bg-[#f8ece7]'}`}>
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
    return (<AnimatedPressable className={`flex-row items-center justify-between gap-3 rounded-[20px] border px-4 py-[15px] ${preferences.darkMode ? 'border-[#35101b] bg-[#0f0f10]' : 'border-line bg-card'}`} onPress={onPress}>
      <View className="flex-1 flex-row items-center gap-3">
        <View className={`h-[34px] w-[34px] items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#1b1014]' : 'bg-[#f8ece7]'}`}>
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
    return (<View className={`flex-1 gap-2.5 rounded-[22px] border p-4 ${preferences.darkMode ? 'border-[#35101b] bg-[#0f0f10]' : 'border-line bg-card'}`}>
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

export function LockedDetailOverlay({ title = 'Unlock', subtitle = 'Subscribe to more', onPress }) {
    return (<View className="absolute inset-0 items-center justify-center px-5" style={{ backgroundColor: 'rgba(34, 11, 52, 0.28)' }}>
      <View className="w-full max-w-[340px] items-center rounded-[28px] border border-white/55 bg-white/94 px-6 py-7 shadow-card">
        <View className="absolute right-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-[#f8e8d8]">
          <Ionicons name="lock-closed" size={18} color={palette.primary}/>
        </View>
        <View className="h-[68px] w-[68px] items-center justify-center rounded-[22px]" style={{ backgroundColor: `${palette.primary}14` }}>
          <Ionicons name="lock-closed" size={30} color={palette.primary}/>
        </View>
        <Text className="mt-4 text-[24px] font-black text-ink">{title}</Text>
        <Text className="mt-1 text-center text-[13px] leading-5 text-muted">{subtitle}</Text>
        <AnimatedPressable className="mt-5 w-full rounded-[18px] bg-brand py-3.5" onPress={onPress}>
          <Text className="text-center text-[14px] font-extrabold text-white">Unlock Now</Text>
        </AnimatedPressable>
      </View>
    </View>);
}

export function UnlockBottomSheet({ title = 'Unlock More', subtitle = 'Subscribe to more', onClose, onPress }) {
    return (<Modal animationType="fade" transparent visible onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0" onPress={onClose}>
          <View className="absolute inset-0 bg-[#140b18]/45"/>
          <View className="absolute inset-0 bg-white/10"/>
        </Pressable>

        <View className="absolute inset-x-0 bottom-0 px-4 pb-4">
          <View className="overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-card">
            <View className="absolute inset-x-0 top-0 h-20 bg-brand"/>
            <View className="px-6 pb-8 pt-4">
              <View className="mb-8 items-center">
                <View className="h-1 w-16 rounded-full bg-[#e8d7d3]"/>
              </View>

              <View className="mb-4 flex-row justify-end">
                <Pressable className="h-10 w-10 items-center justify-center  rounded-full bg-[#f9f1ee]" onPress={onClose}>
                  <Ionicons name="close" size={18} color={palette.text}/>
                </Pressable>
              </View>

              <View className="items-center">
                <View className="h-[76px] w-[76px] items-center justify-center rounded-[24px] border border-[#ffd8df] bg-[#fff5f7]">
                  <Ionicons name="lock-closed" size={34} color={palette.primary}/>
                </View>
                <Text className="mt-5 text-center text-[26px] font-black text-ink">{title}</Text>
                <Text className="mt-2 px-3 text-center text-[14px] leading-6 text-muted">{subtitle}</Text>
                <AnimatedPressable className="mt-7 w-full rounded-[20px] bg-brand py-4" onPress={onPress}>
                  <Text className="text-center px-2 text-[15px] font-extrabold text-white">View Plans & Unlock</Text>
                </AnimatedPressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>);
}

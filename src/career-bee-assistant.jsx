import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, DeviceEventEmitter, Easing, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from './app-state';
import { BeeMascot } from './bee-mascot';
import { palette } from './careermap-data';

const starterPrompts = [
    'What careers suit me?',
    'How to prepare for JEE?',
    'Tell me about scholarships',
    'Help me choose a stream',
    'I need support',
];

const starterReplies = {
    'what careers suit me': 'Start with your strengths, favorite subjects, and the kind of work you enjoy. The Assessment and Career Library screens in this app are the best first step.',
    'how to prepare for jee': 'Focus on PCM basics, a weekly mock-test routine, and revision blocks. I can also guide you toward Entrance Exam and mentor support inside the app.',
    'tell me about scholarships': 'Open the Scholarships section to filter active options, deadlines, and eligibility. I can help you shortlist merit, science, or need-based scholarships.',
    'help me choose a stream': 'Think about your interests, comfort with subjects, and future goals. Science fits tech and medical paths, Commerce fits business and finance, and Arts opens design, law, media, and social sciences.',
    'i need support': 'You are not alone here. Try the Assessment tab for clarity, then book a mentor session for one-on-one guidance if you want a more personal plan.',
};

function getAssistantReply(message) {
    const normalized = message.trim().toLowerCase();
    const match = Object.keys(starterReplies).find((key) => normalized.includes(key));
    if (match) {
        return starterReplies[match];
    }
    if (normalized.includes('payment') || normalized.includes('card') || normalized.includes('upi')) {
        return 'For payments, UPI, card, and net banking all work in the latest flow. If a button still looks disabled, fill every required field and I can help you check which one is missing.';
    }
    if (normalized.includes('mentor')) {
        return 'Mentor booking works best after picking the right date, slot, and payment method. You can use it for engineering, design, business, and career counselling guidance.';
    }
    return 'I can help with careers, exams, scholarships, mentor booking, streams, or app navigation. Try asking something specific and I will guide you.';
}

export function CareerBeeAssistant({ hidden = false }) {
    const { preferences } = useAppState();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const [open, setOpen] = useState(false);
    const [scrollHidden, setScrollHidden] = useState(false);
    const [draft, setDraft] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            text: "Hey! I'm Career Bee. Ask me anything about careers, exams, streams, scholarships, or support.",
        },
    ]);
    const bubbleScale = useRef(new Animated.Value(1)).current;
   
    const sheetAnim = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const themed = useMemo(() => ({
        launcherShadow: preferences.darkMode ? '#000000' : '#6e1730',
        sheet: preferences.darkMode ? '#090909' : '#ffffff',
        sheetBorder: preferences.darkMode ? '#2d0f18' : '#eadadf',
        sheetHeader: preferences.darkMode ? '#2a0613' : '#b41d36',
        sheetSubtle: preferences.darkMode ? '#101010' : '#fff7f9',
        text: preferences.darkMode ? '#ffffff' : palette.text,
        muted: preferences.darkMode ? '#b8a9b0' : palette.muted,
        inputBg: preferences.darkMode ? '#141414' : '#f5eff1',
        chipBg: preferences.darkMode ? '#140c0f' : '#fff7f9',
        chipBorder: preferences.darkMode ? '#5c1b30' : '#efb9c9',
    }), [preferences.darkMode]);

    const animateBubble = (value) => {
        Animated.spring(bubbleScale, {
            toValue: value,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    const openSheet = () => {
        setOpen(true);
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 220,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(sheetAnim, {
                toValue: 1,
                duration: 260,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeSheet = () => {
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 180,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(sheetAnim, {
                toValue: 0,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) {
                setOpen(false);
            }
        });
    };

    const sendMessage = (text) => {
        const message = text.trim();
        if (!message) {
            return;
        }
        const userEntry = { id: `user-${Date.now()}`, role: 'user', text: message };
        const assistantEntry = { id: `assistant-${Date.now()}`, role: 'assistant', text: getAssistantReply(message) };
        setMessages((current) => [...current, userEntry, assistantEntry]);
        setDraft('');
    };
    const compactLauncher = width < 420;
    const launcherSize = compactLauncher ? 74 : 100;

    useEffect(() => {
        if (!compactLauncher) {
            setScrollHidden(false);
            return undefined;
        }
        let idleTimer;
        const showLater = () => {
            if (idleTimer) {
                clearTimeout(idleTimer);
            }
            idleTimer = setTimeout(() => setScrollHidden(false), 180);
        };
        const activeSub = DeviceEventEmitter.addListener('careermap:scroll-active', () => {
            if (idleTimer) {
                clearTimeout(idleTimer);
            }
            setScrollHidden(true);
        });
        const idleSub = DeviceEventEmitter.addListener('careermap:scroll-idle', showLater);
        return () => {
            if (idleTimer) {
                clearTimeout(idleTimer);
            }
            activeSub.remove();
            idleSub.remove();
        };
    }, [compactLauncher]);

    if (hidden) {
        return null;
    }

    const translateY = sheetAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 0],
    });
    const rootOverlayProps = Platform.OS === 'web'
        ? { style: { pointerEvents: 'box-none', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 9999, elevation: 9999 } }
        : { pointerEvents: 'box-none', style: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 9999, elevation: 9999 } };
    const openOverlayProps = Platform.OS === 'web'
        ? { style: { pointerEvents: 'box-none', flex: 1, opacity: overlayOpacity } }
        : { pointerEvents: 'box-none', style: { flex: 1, opacity: overlayOpacity } };
    const launcherProps = Platform.OS === 'web'
        ? {
            style: {
                pointerEvents: 'box-none',
                position: 'absolute',
                right: compactLauncher ? 10 : 18,
                bottom: compactLauncher ? Math.max(insets.bottom + 4, 30) : Math.max(insets.bottom + 22, 55),
                transform: [{ scale: bubbleScale }],
                zIndex: 9999,
                elevation: 9999,
            },
        }
        : {
            pointerEvents: 'box-none',
            style: {
                position: 'absolute',
                right: compactLauncher ? 10 : 18,
                bottom: compactLauncher ? Math.max(insets.bottom + 4, 30) : Math.max(insets.bottom + 22, 55),
                transform: [{ scale: bubbleScale }],
                zIndex: 9999,
                elevation: 9999,
            },
        };

    return (
        <>
            {open ? (
                <View {...rootOverlayProps}>
                    <Animated.View {...openOverlayProps}>
                        <Pressable onPress={closeSheet} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Animated.View
                                style={{
                                    marginHorizontal: 18,
                                    marginBottom: Math.max(insets.bottom + 14, 20),
                                    borderRadius: 28,
                                    backgroundColor: themed.sheet,
                                    borderWidth: 1,
                                    borderColor: themed.sheetBorder,
                                    overflow: 'hidden',
                                    transform: [{ translateY }],
                                    shadowColor: '#000',
                                    shadowOpacity: 0.28,
                                    shadowRadius: 24,
                                    shadowOffset: { width: 0, height: 14 },
                                    elevation: 18,
                                    maxHeight: '72%',
                                }}
                            >
                                <View style={{ backgroundColor: themed.sheetHeader, paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                          <BeeMascot size={50} draggable={false} />
                                
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>Career Bee</Text>
                                        <Text style={{ color: '#f7c6d5', fontSize: 11, fontWeight: '700' }}>Always here for you</Text>
                                    </View>
                                    <Pressable onPress={closeSheet} style={{ height: 34, width: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}>
                                        <Ionicons name="close" size={18} color="#fff" />
                                    </Pressable>
                                </View>

                                <ScrollView
                                    contentContainerStyle={{ padding: 16, gap: 12, backgroundColor: themed.sheet }}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {messages.map((message) => {
                                        const isUser = message.role === 'user';
                                        return (
                                            <View
                                                key={message.id}
                                                style={{
                                                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                                                    maxWidth: '88%',
                                                    backgroundColor: isUser ? palette.primary : themed.sheetSubtle,
                                                    borderRadius: 18,
                                                    paddingHorizontal: 14,
                                                    paddingVertical: 12,
                                                    borderWidth: isUser ? 0 : 1,
                                                    borderColor: isUser ? 'transparent' : themed.sheetBorder,
                                                }}
                                            >
                                                <Text style={{ color: isUser ? '#fff' : themed.text, fontSize: 13, lineHeight: 20, fontWeight: '600' }}>
                                                    {message.text}
                                                </Text>
                                            </View>
                                        );
                                    })}

                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                        {starterPrompts.map((prompt) => (
                                            <Pressable
                                                key={prompt}
                                                onPress={() => sendMessage(prompt)}
                                                style={{
                                                    borderRadius: 999,
                                                    borderWidth: 1,
                                                    borderColor: themed.chipBorder,
                                                    backgroundColor: themed.chipBg,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 8,
                                                }}
                                            >
                                                <Text style={{ color: palette.primary, fontSize: 11, fontWeight: '700' }}>{prompt}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </ScrollView>

                                <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4, backgroundColor: themed.sheet }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: themed.inputBg, borderRadius: 22, paddingLeft: 14, paddingRight: 8, paddingVertical: 6 }}>
                                        <TextInput
                                            value={draft}
                                            onChangeText={setDraft}
                                            placeholder="Ask Career Bee anything..."
                                            placeholderTextColor={themed.muted}
                                            style={{ flex: 1, color: themed.text, fontSize: 13, paddingVertical: 10 }}
                                        />
                                        <Pressable
                                            onPress={() => sendMessage(draft)}
                                            style={{
                                                height: 38,
                                                width: 38,
                                                borderRadius: 19,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: palette.primary,
                                                opacity: draft.trim() ? 1 : 0.45,
                                            }}
                                            disabled={!draft.trim()}
                                        >
                                            <Ionicons name="send" size={16} color="#fff" />
                                        </Pressable>
                                    </View>
                                </View>
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </Animated.View>
                </View>
            ) : null}

            {!open && !scrollHidden ? (
                <Animated.View {...launcherProps}>
                    <Pressable
                        onPress={openSheet}
                        onPressIn={() => animateBubble(0.94)}
                        onPressOut={() => animateBubble(1)}
                    >
                        <BeeMascot size={launcherSize} draggable={false} />
                    </Pressable>
                </Animated.View>
            ) : null}
        </>
    );
}

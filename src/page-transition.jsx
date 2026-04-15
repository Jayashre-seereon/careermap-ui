import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function ZoomInPage({ children, style, duration = 320, initialScale = 0.97, initialTranslateY = 10 }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(initialScale)).current;
    const translateY = useRef(new Animated.Value(initialTranslateY)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, [duration, initialScale, initialTranslateY, opacity, scale, translateY]);
    return (<Animated.View style={[style, { opacity, transform: [{ scale }, { translateY }] }]}>
      {children}
    </Animated.View>);
}

export function StaggerFadeUpItem({ children, index = 0, style, duration = 320, stepDelay = 110 }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration,
                delay: index * stepDelay,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration,
                delay: index * stepDelay,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, [duration, index, opacity, stepDelay, translateY]);
    return (<Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>);
}

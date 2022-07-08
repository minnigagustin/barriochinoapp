import { useRef, useEffect, useState, useMemo } from 'react';
import { Animated } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../utils/screen";
export function usePortalAnimation({ visible, animationType, animationDuration, animmationEasing, elementHeight = SCREEN_HEIGHT, elementWidth = SCREEN_WIDTH, }) {
    const [visibleState, setVisibleState] = useState(visible);
    const animmationEasingRef = useRef(animmationEasing);
    const animation = useRef(new Animated.Value(0));
    useEffect(() => {
        visible && setVisibleState(true);
        Animated.timing(animation.current, {
            toValue: visible ? 100 : 0,
            duration: animationType === 'none' ? 0 : animationDuration,
            easing: animmationEasingRef.current,
            useNativeDriver: true,
        }).start(() => {
            setVisibleState(visible);
        });
    }, [animationDuration, animationType, visible]);
    const slide = useMemo(() => {
        const checkNegativeAndPositiveNumber = animationType === 'slide-up' || animationType === 'slide-left';
        const checkVertical = animationType === 'slide-up' || animationType === 'slide-down';
        const switchNegativeAndPositiveNumber = checkNegativeAndPositiveNumber ? 1 : -1;
        const outputFirst = (checkVertical ? elementHeight : elementWidth) * switchNegativeAndPositiveNumber;
        return animation.current.interpolate({
            inputRange: [0, 100],
            outputRange: [outputFirst, 0],
            extrapolate: 'clamp',
        });
    }, [animationType, elementHeight, elementWidth]);
    const fade = animation.current.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });
    const zoom = animation.current.interpolate({
        inputRange: [0, 100],
        outputRange: [0.4, 1],
        extrapolate: 'clamp',
    });
    const checkAnimated = () => {
        switch (animationType) {
            case 'slide-up':
            case 'slide-down':
                return { transform: [{ translateY: slide }] };
            case 'slide-left':
            case 'slide-right':
                return { transform: [{ translateX: slide }] };
            case 'zoom':
                return { transform: [{ scale: zoom }], opacity: fade };
            case 'fade':
                return { opacity: fade };
            default:
                return {};
        }
    };
    return { visibleState, animationStyle: checkAnimated() };
}

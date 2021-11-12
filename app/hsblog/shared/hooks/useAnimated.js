import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
export function useAnimated({ toValue, duration = 200, useNativeDriver = true, }) {
    const animation = useRef(new Animated.Value(0));
    const onAnimated = useCallback(() => {
        Animated.timing(animation.current, {
            toValue,
            duration,
            useNativeDriver,
        }).start();
    }, [duration, toValue, useNativeDriver]);
    return [animation.current, onAnimated];
}

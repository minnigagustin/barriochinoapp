import { useRef } from 'react';
import { Animated } from 'react-native';
import { statusBarHeight } from "../../utils/constants/base";
const STATUS_BAR_HEIGHT = statusBarHeight;
function useHeaderAnimated(headerHeight = 64) {
    const scrollAnim = useRef(new Animated.Value(0));
    const offsetAnim = useRef(new Animated.Value(0));
    const clampedScroll = useRef(Animated.diffClamp(Animated.add(scrollAnim.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
    }), offsetAnim.current), 0, headerHeight));
    const opacityText = clampedScroll.current.interpolate({
        inputRange: [0, headerHeight - STATUS_BAR_HEIGHT],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });
    const headerY = clampedScroll.current.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -(headerHeight + STATUS_BAR_HEIGHT)],
        extrapolate: 'clamp',
    });
    return {
        scrollAnim: scrollAnim.current,
        clampedScroll: clampedScroll.current,
        offsetAnim: offsetAnim.current,
        opacityText,
        headerY,
    };
}
export default useHeaderAnimated;
export const onScroll = (scrollAnim) => Animated.event([
    {
        nativeEvent: {
            contentOffset: { y: scrollAnim },
        },
    },
], { useNativeDriver: true });

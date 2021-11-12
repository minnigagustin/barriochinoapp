import { useRef } from 'react';
import { Animated } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
export default function useZoom() {
    const baseScale = useRef(new Animated.Value(1)).current;
    const pinchScale = useRef(new Animated.Value(1)).current;
    const scale = Animated.multiply(baseScale, pinchScale);
    const lastScale = useRef(1);
    const handleZoomEvent = Animated.event([
        {
            nativeEvent: { scale: pinchScale },
        },
    ], {
        useNativeDriver: true,
    });
    const handleZoomStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            lastScale.current *= event.nativeEvent.scale;
            baseScale.setValue(lastScale.current);
            pinchScale.setValue(1);
            if (lastScale.current < 1) {
                Animated.spring(baseScale, {
                    toValue: 1,
                    useNativeDriver: true,
                }).start();
                lastScale.current = 1;
            }
            if (lastScale.current > 4) {
                Animated.spring(baseScale, {
                    toValue: 4,
                    useNativeDriver: true,
                }).start();
                lastScale.current = 4;
            }
        }
    };
    return {
        scale,
        handleZoomEvent,
        handleZoomStateChange,
        PinchGestureHandler,
    };
}

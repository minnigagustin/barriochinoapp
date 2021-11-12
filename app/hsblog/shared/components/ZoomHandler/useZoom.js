import { useRef } from 'react';
import { Animated } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, State, } from 'react-native-gesture-handler';
import { SCREEN_WIDTH } from "../../utils/screen";
// const ZOOM_MAX = 5;
// const ZOOM_MIN = 1;
const PERSPECTIVE = 200;
export default function useZoom({ zoomMin, zoomMax, imageWidth }) {
    const baseScale = useRef(new Animated.Value(1)).current;
    const pinchScale = useRef(new Animated.Value(1)).current;
    const scale = Animated.multiply(baseScale, pinchScale);
    const lastScale = useRef(1);
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const lastOffset = useRef({ translationX: 0, translationY: 0 });
    const aaa = useRef(1);
    // const widthAnim = scale.interpolate({
    //   inputRange: [ZOOM_MIN, ZOOM_MAX],
    //   outputRange: [imageWidth * ZOOM_MIN, imageWidth * ZOOM_MAX],
    //   extrapolate: 'clamp',
    // });
    // const heightAnim = scale.interpolate({
    //   inputRange: [ZOOM_MIN, ZOOM_MAX],
    //   outputRange: [imageHeight * ZOOM_MIN, imageHeight * ZOOM_MAX],
    //   extrapolate: 'clamp',
    // });
    const handleZoomEvent = Animated.event([
        {
            nativeEvent: { scale: pinchScale },
        },
    ]);
    const handleZoomStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            lastScale.current *= event.nativeEvent.scale;
            baseScale.setValue(lastScale.current);
            pinchScale.setValue(1);
            if (lastScale.current < zoomMin) {
                Animated.spring(baseScale, {
                    toValue: zoomMin,
                    useNativeDriver: false,
                }).start();
                lastScale.current = zoomMin;
            }
            if (lastScale.current > zoomMax) {
                Animated.spring(baseScale, {
                    toValue: zoomMax,
                    useNativeDriver: false,
                }).start();
                lastScale.current = zoomMax;
            }
        }
    };
    const handleDragEvent = Animated.event([
        {
            nativeEvent: {
                translationX: translateX,
                translationY: translateY,
            },
        },
    ]);
    const handleDragStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            lastOffset.current.translationX += event.nativeEvent.translationX;
            lastOffset.current.translationY += event.nativeEvent.translationY;
            translateX.setOffset(lastOffset.current.translationX);
            translateX.setValue(0);
            translateY.setOffset(lastOffset.current.translationY);
            translateY.setValue(0);
            aaa.current = (imageWidth * lastScale.current - SCREEN_WIDTH) / 2;
            console.log(123, lastOffset.current.translationX, lastScale.current, aaa.current);
            if (lastOffset.current.translationX > aaa.current && lastOffset.current.translationX < imageWidth) {
                Animated.spring(translateX, {
                    toValue: (lastOffset.current.translationX - aaa.current) * -1,
                    useNativeDriver: false,
                }).start(() => {
                    translateX.setOffset(0);
                    translateX.setValue(0);
                });
                lastOffset.current = { ...lastOffset.current, translationX: 0 };
            }
            // if (lastOffset.current.translationY > 0 && lastOffset.current.translationY < imageHeight) {
            //   Animated.spring(translateY, {
            //     toValue: lastOffset.current.translationY * -1,
            //     useNativeDriver: false,
            //   }).start(() => {
            //     translateY.setOffset(0);
            //     translateY.setValue(0);
            //   });
            //   lastOffset.current = { ...lastOffset.current, translationY: 0 };
            // }
        }
    };
    const transform = [{ perspective: PERSPECTIVE }, { scale }, { translateX }, { translateY }];
    return {
        handleZoomEvent,
        handleZoomStateChange,
        handleDragEvent,
        handleDragStateChange,
        PanGestureHandler,
        PinchGestureHandler,
        translateX,
        translateY,
        scale,
        transform,
    };
}

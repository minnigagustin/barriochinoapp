import React, { useState, useRef } from 'react';
import { View as RNView, Animated, ScrollView } from 'react-native';
import isIOS from "../../utils/isIOS";
import useZoom from './useZoom';
const ZOOM_MAX = 3;
const ZOOM_MIN = 1;
export const ZoomHandler = ({ children, style }) => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);
    const { PanGestureHandler, PinchGestureHandler, handleDragEvent, handleDragStateChange, handleZoomEvent, handleZoomStateChange, translateX, translateY, scale, } = useZoom({
        zoomMin: ZOOM_MIN,
        zoomMax: ZOOM_MAX,
        imageWidth: size.width,
        imageHeight: size.height,
    });
    const handleContainerRef = (c) => {
        containerRef.current = c;
    };
    // const widthAnim = scale.interpolate({
    //   inputRange: [ZOOM_MIN, ZOOM_MAX],
    //   outputRange: [size.width * ZOOM_MIN, size.width * ZOOM_MAX],
    //   extrapolate: 'clamp',
    // });
    // const heightAnim = scale.interpolate({
    //   inputRange: [ZOOM_MIN, ZOOM_MAX],
    //   outputRange: [size.height * ZOOM_MIN, size.height * ZOOM_MAX],
    //   extrapolate: 'clamp',
    // });
    if (isIOS) {
        return (<ScrollView alwaysBounceHorizontal alwaysBounceVertical showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} minimumZoomScale={1} maximumZoomScale={4}>
        {children}
      </ScrollView>);
    }
    return (<PanGestureHandler onGestureEvent={handleDragEvent} onHandlerStateChange={handleDragStateChange}>
      <RNView ref={handleContainerRef} style={style}>
        <Animated.View style={{ transform: [{ translateX }, { translateY }] }}>
          <PinchGestureHandler onGestureEvent={handleZoomEvent} onHandlerStateChange={event => {
        if (containerRef.current && !size.width && !size.height) {
            containerRef.current.measure((_x, _y, width, height) => {
                setSize({ width, height });
            });
        }
        handleZoomStateChange(event);
    }}>
            <Animated.View style={{ transform: [{ scale }], opacity: 0.4 }}>{children}</Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </RNView>
    </PanGestureHandler>);
};

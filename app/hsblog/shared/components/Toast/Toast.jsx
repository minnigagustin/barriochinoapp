import React, { useState, useRef, memo } from 'react';
import Emitter from "../../utils/emitter";
import { useMount } from "../../hooks/useMount";
import { useUnmount } from "../../hooks/useUnmount";
import { Easing, Animated } from 'react-native';
import { usePortalAnimation } from "../../hooks/usePortalAnimation";
import { tachyonsStyles } from "../../themes/tachyons";
import { Text } from '../Text/Text';
import { View } from '../View/View';
import { styles } from './styles';
const ToastEvent = new Emitter();
const defaultPayload = {
    duration: 2000,
    content: '',
    style: {},
    placement: 'bottom',
    animationType: 'fade',
};
const defaultState = {
    visible: false,
    content: '',
    style: {},
    placement: 'bottom',
    animationType: 'fade',
    tailwind: [],
    tachyons: [],
};
const getPlacementStyle = (placement, height) => {
    switch (placement) {
        case 'top':
            return {
                top: 10,
            };
        case 'center':
            return {
                top: '50%',
                marginTop: !!height ? -height / 2 : 0,
            };
        case 'bottom':
            return {
                bottom: 10,
            };
        default:
            return {};
    }
};
export const Toast = {
    show(payload) {
        const _payload = {
            ...defaultPayload,
            ...(typeof payload === 'string' ? { content: payload } : payload),
        };
        ToastEvent.emit('TOAST_SHOW', _payload);
    },
};
export const ToastUI = memo(() => {
    const [visible, setVisible] = useState(defaultState.visible);
    const [content, setContent] = useState(defaultState.content);
    const [style, setStyle] = useState(defaultState.style);
    const [placement, setPlacement] = useState(defaultState.placement);
    const [animationType, setAnimationType] = useState(defaultState.animationType);
    const [tailwind, setTailwind] = useState(defaultState.tailwind);
    const [tachyons, setTachyons] = useState(defaultState.tachyons);
    const [height, setHeight] = useState(0);
    const show = useRef(0);
    const timeout = useRef(0);
    const { visibleState, animationStyle } = usePortalAnimation({
        visible,
        animationType,
        animationDuration: 200,
        animmationEasing: Easing.bezier(0.46, 0.79, 0.54, 0.98),
        elementHeight: height,
    });
    const handleLayoutContainer = (event) => {
        setHeight(event.nativeEvent.layout.height);
    };
    const handleShow = (payload) => {
        setVisible(true);
        setContent(payload.content);
        setStyle(payload.style);
        !!payload.placement && setPlacement(payload.placement);
        !!payload.animationType && setAnimationType(payload.animationType);
        !!payload.tailwind && setTailwind(payload.tailwind);
        !!payload.tachyons && setTachyons(payload.tachyons);
        payload.onOpenEnd?.();
        timeout.current = setTimeout(() => {
            setVisible(false);
            payload.onCloseEnd?.();
            clearTimeout(timeout.current);
        }, payload.duration);
    };
    useMount(() => {
        if (!visible) {
            show.current = ToastEvent.on('TOAST_SHOW', handleShow);
        }
    });
    useUnmount(() => {
        ToastEvent.off(show.current);
        clearTimeout(timeout.current);
    });
    if (!visibleState) {
        return null;
    }
    return (<View style={[styles.container, getPlacementStyle(placement, height)]} onLayout={handleLayoutContainer}>
      <View safeAreaView>
        <Animated.View style={[tachyonsStyles.flex, animationStyle]}>
          <View style={[styles.toastInner, style]} tailwind={tailwind} tachyons={tachyons} backgroundColor="dark1">
            {typeof content === 'string' ? <Text color="gray1">{content}</Text> : content}
          </View>
        </Animated.View>
      </View>
    </View>);
});

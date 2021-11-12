import React, { useState, memo } from 'react';
import { Keyboard, LayoutAnimation, Platform, StatusBar } from 'react-native';
import { View, useUnmount, useMount } from "../../shared";
import { SCREEN_HEIGHT } from "../../shared/utils/screen";
import { nightModeSelector } from 'containers/ProfileScreen/selectors';
import { useSelector } from 'react-redux';
import styles from './styles';
const ANDROID = Platform.OS === 'android';
const defaultAnimation = {
    duration: 500,
    create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
    },
    update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200,
    },
};
let keyboardDidShowListener;
let keyboardDidHideListener;
const updateListener = ANDROID ? 'keyboardDidShow' : 'keyboardWillShow';
const resetListener = ANDROID ? 'keyboardDidHide' : 'keyboardWillHide';
function KeyboardSpacer({ topSpacing = 0, onToggle }) {
    const [keyboardSpace, setKeyboardSpace] = useState(0);
    const [_, setKeyboardOpened] = useState(false);
    const nightMode = useSelector(nightModeSelector);
    const _updateKeyboardSpace = (event) => {
        StatusBar.setBarStyle(nightMode ? 'light-content' : 'dark-content');
        if (!event.endCoordinates) {
            return;
        }
        let animationConfig = defaultAnimation;
        if (!ANDROID) {
            animationConfig = LayoutAnimation.create(event.duration, LayoutAnimation.Types[event.easing], LayoutAnimation.Properties.opacity);
        }
        LayoutAnimation.configureNext(animationConfig);
        const keyboardSpace2 = SCREEN_HEIGHT - event.endCoordinates.screenY;
        setKeyboardSpace(keyboardSpace2);
        setKeyboardOpened(true);
        onToggle?.(true, keyboardSpace2);
    };
    const _resetKeyboardSpace = (event) => {
        let animationConfig = defaultAnimation;
        if (!ANDROID) {
            animationConfig = LayoutAnimation.create(event.duration, LayoutAnimation.Types[event.easing], LayoutAnimation.Properties.opacity);
        }
        LayoutAnimation.configureNext(animationConfig);
        setKeyboardSpace(0);
        setKeyboardOpened(false);
        onToggle?.(false, 0);
    };
    useMount(() => {
        keyboardDidShowListener = Keyboard.addListener(updateListener, _updateKeyboardSpace);
        keyboardDidHideListener = Keyboard.addListener(resetListener, _resetKeyboardSpace);
    });
    useUnmount(() => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
    });
    return <View style={[styles.container, { height: keyboardSpace + topSpacing }]}/>;
}
export default memo(KeyboardSpacer);

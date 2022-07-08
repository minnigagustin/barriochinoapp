import React, { useState, useRef } from 'react';
import { View, LayoutAnimation, Platform, Dimensions, Keyboard, UIManager } from 'react-native';
import { useMount, useUnmount } from "../../shared";
import styles from './styles';
// @ts-ignore
const accessoryAnimation = (duration, easing, animationConfig = null) => {
    if (animationConfig) {
        if (typeof animationConfig === 'function') {
            // @ts-ignore
            return animationConfig(duration, easing);
        }
        return animationConfig;
    }
    if (Platform.OS === 'android') {
        return {
            duration: 200,
            create: {
                duration: 200,
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.linear,
            },
        };
    }
    // @ts-ignore
    return LayoutAnimation.create(duration, LayoutAnimation.Types[easing], LayoutAnimation.Properties.opacity);
};
const { height, width } = Dimensions.get('window');
const isSafeAreaSupported = Platform.OS === 'ios' && (height > 800 || width > 800);
const KeyBoardAccessory = ({ style, animateOn = 'ios', animationConfig, bumperHeight = 15, visibleOpacity = 1, hiddenOpacity = 0, onKeyboardShowDelay, androidAdjustResize = false, alwaysVisible = false, inSafeAreaView = true, avoidKeyboard = false, hideBorder = false, children, backgroundColor = '#fff', }) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [accessoryHeight, setAccessoryHeight] = useState(50);
    const [visibleAccessoryHeight, setVisibleHeight] = useState(50);
    const [isKeyboardVisible, setIsVisible] = useState(false);
    const keyboardShowEventListener = useRef(null);
    const keyboardHideEventListener = useRef(null);
    // @ts-ignore
    const handleChildrenLayout = (layoutEvent) => {
        setVisibleHeight(layoutEvent.nativeEvent.layout.height);
        setAccessoryHeight(alwaysVisible || isKeyboardVisible ? layoutEvent.nativeEvent.layout.height : 0);
    };
    const handleKeyboardHide = (keyboardEvent) => {
        if (animateOn === 'all' || Platform.OS === animateOn) {
            LayoutAnimation.configureNext(animationConfig ?? accessoryAnimation(keyboardEvent.duration, keyboardEvent.easing, animationConfig));
        }
        setIsVisible(false);
        setKeyboardHeight(0);
        setAccessoryHeight(alwaysVisible ? visibleAccessoryHeight : 0);
    };
    const handleKeyboardShow = (keyboardEvent) => {
        if (!keyboardEvent.endCoordinates) {
            return;
        }
        const keyboardHeight = Platform.select({
            ios: keyboardEvent.endCoordinates.height,
            android: androidAdjustResize ? 0 : keyboardEvent.endCoordinates.height,
        });
        const keyboardAnimate = () => {
            if (animateOn === 'all' || Platform.OS === animateOn) {
                // @ts-ignore
                LayoutAnimation.configureNext(accessoryAnimation(keyboardEvent.duration, keyboardEvent.easing, animationConfig));
            }
            setIsVisible(true);
            setKeyboardHeight(keyboardHeight || 0);
        };
        if (Platform.OS === 'ios' || typeof onKeyboardShowDelay !== 'number') {
            keyboardAnimate();
        }
        else {
            setTimeout(() => {
                keyboardAnimate();
            }, onKeyboardShowDelay);
        }
        setIsVisible(true);
        setKeyboardHeight(keyboardHeight || 0);
        setAccessoryHeight(visibleAccessoryHeight);
    };
    useMount(() => {
        const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
        // @ts-ignore
        keyboardShowEventListener.current = Keyboard.addListener(keyboardShowEvent, handleKeyboardShow);
        // @ts-ignore
        keyboardHideEventListener.current = Keyboard.addListener(keyboardHideEvent, handleKeyboardHide);
        Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    });
    useUnmount(() => {
        // @ts-ignore
        keyboardShowEventListener.current.remove();
        // @ts-ignore
        keyboardHideEventListener.current.remove();
    });
    const visibleHeight = accessoryHeight + (avoidKeyboard ? keyboardHeight : 0);
    const applySafeArea = isSafeAreaSupported && inSafeAreaView;
    return (<View style={[{ height: isKeyboardVisible || alwaysVisible ? visibleHeight : 0 }]}>
      <View style={[
        styles.accessory,
        !hideBorder && styles.accessoryBorder,
        style,
        {
            opacity: isKeyboardVisible || alwaysVisible ? visibleOpacity : hiddenOpacity,
            bottom: keyboardHeight - bumperHeight - (applySafeArea ? 20 : 0),
            height: accessoryHeight + bumperHeight + (applySafeArea ? (!isKeyboardVisible ? 20 : -10) : 0),
            backgroundColor: backgroundColor,
        },
    ]}>
        <View onLayout={handleChildrenLayout}>{children}</View>
      </View>
    </View>);
};
export default KeyBoardAccessory;

import { useState } from 'react';
import { Keyboard, LayoutAnimation } from 'react-native';
import isIOS from "../utils/isIOS";
import { useUnmount } from './useUnmount';
function configureLayoutAnimation(event) {
    return LayoutAnimation.configureNext({
        duration: isIOS ? event.duration : 300,
        create: {
            type: isIOS ? LayoutAnimation.Types.keyboard : LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
        },
        update: {
            type: isIOS ? LayoutAnimation.Types.keyboard : LayoutAnimation.Types.easeInEaseOut,
        },
    });
}
export function useKeyboardHeightAnimation() {
    const [keyboardHeight, setKeyBoardHeight] = useState(0);
    const switchEventNameShow = isIOS ? 'keyboardWillShow' : 'keyboardDidShow';
    const switchEventNameHide = isIOS ? 'keyboardWillHide' : 'keyboardDidHide';
    const handleKeyboardShow = Keyboard.addListener(switchEventNameShow, event => {
        const keyboardHeight = isIOS ? event.endCoordinates.height : event.endCoordinates.height - 100;
        configureLayoutAnimation(event);
        setKeyBoardHeight(keyboardHeight);
    });
    const handleKeyboardHide = Keyboard.addListener(switchEventNameHide, event => {
        configureLayoutAnimation(event);
        setKeyBoardHeight(0);
    });
    useUnmount(() => {
        handleKeyboardShow.remove();
        handleKeyboardHide.remove();
    });
    return keyboardHeight;
}

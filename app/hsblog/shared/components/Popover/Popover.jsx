import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { useSwitchAnimation } from "../../hooks/useSwitchAnimation";
import { View } from "../View/View";
import { useTheme } from "../ThemeContext/ThemeContext";
import { styles } from './styles';
// const AnimatedView = posed.View({
//   open: { opacity: 1, scale: 1, transition: { duration: 100 } },
//   closed: { opacity: 0, scale: 0.4, transition: { duration: 100 } },
// });
export function Popover({ children, Content, style = {}, placement = 'top', appearance = 'light' }) {
    const { styled } = useTheme();
    const { buttonRef, contentRef, contentStyle, isVisible, onClose, onOpen } = useSwitchAnimation({
        placement,
        duration: 100,
    });
    const popoverInnerStyle = [styles.popoverInner, styles.shadow, appearance === 'light' ? styled.bgLight : styled.bgDark1];
    const popoverContentStyle = [styles.popoverOuter, contentStyle];
    return (<>
      <Modal visible={isVisible} animationType="fade" transparent onRequestClose={onClose}>
        <View ref={contentRef} style={popoverContentStyle}>
          <View style={popoverInnerStyle}>{Content}</View>
        </View>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.underlay}/>
      </Modal>
      <TouchableOpacity ref={buttonRef} onPress={onOpen} style={style}>
        {children}
      </TouchableOpacity>
    </>);
}

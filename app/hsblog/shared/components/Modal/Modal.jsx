import React from 'react';
import { Animated, Easing } from 'react-native';
import { View } from "../..";
import { usePortalAnimation } from "../../hooks/usePortalAnimation";
import { tailwindStyles } from "../../themes/tailwind";
import { ModalBase } from '../ModalBase/ModalBase';
export const Modal = ({ children, visible = false, style, animationType = 'none', animationDuration = 400, animmationEasing = Easing.bezier(0.46, 0.79, 0.54, 0.98), ...otherProps }) => {
    const { visibleState, animationStyle } = usePortalAnimation({ visible, animationType, animationDuration, animmationEasing });
    return (<ModalBase visible={visibleState} {...otherProps}>
      <Animated.View style={[tailwindStyles['flex-1'], animationStyle]}>
        <View flex style={style}>
          {children}
        </View>
      </Animated.View>
    </ModalBase>);
};

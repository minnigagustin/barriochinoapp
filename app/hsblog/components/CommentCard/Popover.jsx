import React, { useState } from 'react';
import { View } from "../../shared";
import { usePortalAnimation } from "../../shared/hooks/usePortalAnimation";
import { Easing, Animated } from 'react-native';
const Popover = ({ animationType = 'fade', animationDuration = 200, animmationEasing = Easing.linear, PopoverComponent, renderElementChange, }) => {
    const elementHeight = 200;
    const [visible, setVisible] = useState(false);
    const [height, setHeight] = useState(0);
    const { visibleState, animationStyle } = usePortalAnimation({
        visible,
        elementHeight,
        animationType,
        animmationEasing,
        animationDuration,
    });
    const showPopup = () => {
        setVisible(true);
    };
    const closePopup = () => {
        setVisible(false);
    };
    return (<View style={{ position: 'relative' }}>
      {visibleState && (<Animated.View style={[
        animationStyle,
        {
            top: -height - 10,
            position: 'absolute',
        },
    ]} onLayout={(event) => setHeight(event.nativeEvent.layout.height)}>
          {PopoverComponent}
        </Animated.View>)}
      {renderElementChange(showPopup, closePopup)}
    </View>);
};
export default Popover;

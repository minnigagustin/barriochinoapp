import React, { forwardRef, memo } from 'react';
import { View as RNView } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import getFlexStyle from "../../utils/getFlexStyle";
import { useMount } from "../../hooks/useMount";
import { withViewStyles } from "../../hocs/withViewStyles";
import { useTheme } from '../ThemeContext/ThemeContext';
import styles from './styles';
const ViewWithStyles = withViewStyles(RNView);
const ViewComponent = forwardRef(({ children, flex = false, safeAreaView = false, safeAreaViewBottom = false, shadow = false, style = {}, onMount, ...rest }, ref) => {
    const { debug } = useTheme();
    const insets = useSafeArea();
    const flexStyle = getFlexStyle(flex);
    const shadowStyle = shadow ? styles.shadow : {};
    useMount(() => {
        onMount?.();
    });
    return (<ViewWithStyles ref={ref} style={[shadowStyle, flexStyle, style, debug ? styles.debug : styles.empty]} {...rest}>
        {safeAreaView && <RNView style={{ height: insets.top }}/>}
        {children}
        {safeAreaViewBottom && <RNView style={{ height: insets.bottom }}/>}
      </ViewWithStyles>);
});
export const View = memo(ViewComponent);

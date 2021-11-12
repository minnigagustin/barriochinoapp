import React, { memo } from 'react';
import { View } from "../View/View";
import getBorderWidthStyle from "../../utils/getBorderWidthStyle";
import { withTailwind } from "../../hocs/withTailwind";
import { useTheme } from '../ThemeContext/ThemeContext';
import { styles } from './styles';
function CardComponent({ Header, Body, Footer, borderColor = 'gray1', borderWidth, shadow, backgroundColor = 'light', useDivider = false, dividerColor = 'gray2', style = {}, borderRadius = 0, ...otherProps }) {
    const { colors } = useTheme();
    const borderWidthStyle = !!borderWidth ? getBorderWidthStyle(borderWidth) : {};
    const shadowStyle = shadow ? styles.shadow : {};
    const dividerStyle = useDivider ? [styles.divider, { borderColor: colors[dividerColor] }] : {};
    const inlineStyle = {
        borderColor: colors[borderColor],
        backgroundColor: colors[backgroundColor],
        borderRadius,
    };
    return (<View {...otherProps} style={[borderWidthStyle, shadowStyle, inlineStyle, style]}>
      {!!Header && <View style={[styles.header, !!Body || !!Footer ? dividerStyle : {}]}>{Header}</View>}
      {!!Body && <View style={!!Footer ? dividerStyle : {}}>{Body}</View>}
      {!!Footer && <View>{Footer}</View>}
    </View>);
}
export const Card = memo(withTailwind(CardComponent));

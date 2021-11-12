import React, { memo } from 'react';
import { View } from "../View/View";
import { useTheme } from "../ThemeContext/ThemeContext";
import styles from './styles';
function HeaderBaseComponent({ Left, Center, Right, containerStyle = {}, backgroundColor = '' }) {
    const { colors } = useTheme();
    const itemHasCenterStyle = Center ? styles.hasCenter : {};
    return (<View style={[styles.container, { backgroundColor: backgroundColor || colors.light }, containerStyle]}>
      <View style={[styles.item, styles.left, itemHasCenterStyle]}>{Left}</View>
      {!!Center && <View style={[styles.item, styles.center]}>{Center}</View>}
      <View style={[styles.item, styles.right, itemHasCenterStyle]}>{Right}</View>
    </View>);
}
export const HeaderBase = memo(HeaderBaseComponent);

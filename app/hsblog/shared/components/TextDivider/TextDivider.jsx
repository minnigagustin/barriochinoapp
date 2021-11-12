import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from "../ThemeContext/ThemeContext";
import { tailwindStyles } from "../../themes/tailwind";
import styles from './styles';
function TextDividerComponennt({ textStyle = {}, containerStyle = {}, children }) {
    const { styled } = useTheme();
    return (<View style={[styles.container, StyleSheet.flatten(containerStyle)]}>
      <View style={[styles.divider, styled.bgDark4]}></View>
      <View style={styles.textWrap}>
        <Text style={[tailwindStyles['text-sm'], styled.colorDark3, StyleSheet.flatten(textStyle)]}>{children}</Text>
      </View>
      <View style={[styles.divider, styled.bgDark4]}></View>
    </View>);
}
export const TextDivider = memo(TextDividerComponennt);

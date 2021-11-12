import React from 'react';
import { View } from "../View/View";
import { useTheme } from "../ThemeContext/ThemeContext";
import { StyleSheet } from 'react-native';
import { withTailwind } from "../../hocs/withTailwind";
const styles = StyleSheet.create({
    container: {
        height: 1,
    },
});
export const Divider = withTailwind(({ color = 'gray2', style }) => {
    const { colors } = useTheme();
    return <View style={[styles.container, { backgroundColor: colors[color] }, style]}/>;
});

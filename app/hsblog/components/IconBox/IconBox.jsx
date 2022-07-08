import React, { memo } from 'react';
import { View } from 'react-native';
import { useTheme, Icons } from "../../shared";
import styles from './styles';
const IconBox = ({ name, color = 'dark2', backgroundColor = 'gray1', size = 'medium', style = {} }) => {
    const { colors } = useTheme();
    return (<View style={[styles.container, styles[size], { backgroundColor: colors[backgroundColor] }, style]}>
      <Icons.Feather name={name} size={20} color={color} {...(color === 'light' ? { colorNative: '#fff' } : {})}/>
    </View>);
};
export default memo(IconBox);

import React, { memo } from 'react';
import { FontAwesome, Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext/ThemeContext';
export const Icons = {
    FontAwesome: memo(({ color = 'dark2', colorNative, ...rest }) => {
        const { colors } = useTheme();
        return <FontAwesome {...rest} color={!!colorNative ? colorNative : colors[color]}/>;
    }),
    FontAwesome5: memo(({ color = 'dark2', colorNative, ...rest }) => {
        const { colors } = useTheme();
        return <FontAwesome5 {...rest} color={!!colorNative ? colorNative : colors[color]}/>;
    }),
    Feather: memo(({ color = 'dark2', colorNative, ...rest }) => {
        const { colors } = useTheme();
        return <Feather {...rest} color={!!colorNative ? colorNative : colors[color]}/>;
    }),
    MaterialIcons: memo(({ color = 'dark2', colorNative, ...rest }) => {
        const { colors } = useTheme();
        return <MaterialIcons {...rest} color={!!colorNative ? colorNative : colors[color]}/>;
    }),
    MaterialCommunityIcons: memo(({ color = 'dark2', colorNative, ...rest }) => {
        const { colors } = useTheme();
        return <MaterialCommunityIcons {...rest} color={!!colorNative ? colorNative : colors[color]}/>;
    }),
    AntDesign: memo(({ color = 'dark2', colorNative, ...rest }) => {
        const { colors } = useTheme();
        return <AntDesign {...rest} color={!!colorNative ? colorNative : colors[color]}/>;
    }),
};

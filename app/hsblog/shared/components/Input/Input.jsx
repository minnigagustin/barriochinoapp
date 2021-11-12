import React, { useState } from 'react';
import { InputBase } from "../InputBase/InputBase";
import { Icons } from "../Icons/Icons";
import { BaseButton } from 'react-native-gesture-handler';
import { View } from "../View/View";
import getBorderRadiusStyle from "../../utils/getBorderRadiusStyle";
import getBorderWidthStyle from "../../utils/getBorderWidthStyle";
import { tachyonsStyles } from "../../themes/tachyons";
import { useTheme } from '../ThemeContext/ThemeContext';
import styles from './styles';
export function Input({ onChangeText, onFocusText, onFocus, onClearText = () => { }, containerStyle, inputStyle, clearButtonMode = 'never', ClearButtonModeComponent, placeholder = '', borderRadius = 'round', borderWidth = 1, color = 'dark1', backgroundColor = 'light', borderColor = 'dark4', Left, Right, ...otherProps }) {
    const [value, setValue] = useState('');
    const { colors, sizes } = useTheme();
    const inputHasLeftStyle = !!Left ? styles.hasLeft : {};
    const inputHasRightStyle = !!Left ? styles.hasRight : {};
    const _handleChangeText = (text) => {
        setValue(text);
        onChangeText?.(text);
    };
    const _handleClearText = () => {
        setValue('');
        onClearText('');
    };
    const _handleFocus = (event) => {
        onFocusText?.(event.nativeEvent.text);
        onFocus?.(event);
    };
    const ClearButton = (<BaseButton style={[tachyonsStyles.justifyCenter, tachyonsStyles.itemsCenter]} onPress={_handleClearText}>
      {ClearButtonModeComponent ?? <Icons.Feather name="x" color="dark3" size={sizes.base * 1.4} style={[tachyonsStyles.pv2, tachyonsStyles.pr2]}/>}
    </BaseButton>);
    const checkClearMode = {
        always: ClearButton,
        'while-editing': ClearButton,
        'unless-editing': null,
        never: null,
    };
    return (<InputBase {...otherProps} value={value} onChangeText={_handleChangeText} onFocus={_handleFocus} placeholder={placeholder} Left={<View>{Left}</View>} Right={[<View key="item1">{Right}</View>, <View key="item2">{!!value && checkClearMode[clearButtonMode]}</View>]} inputStyle={[styles.input, inputHasLeftStyle, inputHasRightStyle, { color: colors[color] }, inputStyle]} containerStyle={[
        getBorderRadiusStyle(borderRadius),
        getBorderWidthStyle(borderWidth),
        { backgroundColor: colors[backgroundColor], borderColor: colors[borderColor] },
        containerStyle,
    ]}/>);
}

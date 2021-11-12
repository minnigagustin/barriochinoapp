import React, { memo, forwardRef } from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { withTextStyles } from "../../hocs/withTextStyles";
import { useTheme } from '../ThemeContext/ThemeContext';
const styles = StyleSheet.create({
    debug: {
        borderWidth: 1,
        borderColor: '#eb2226',
    },
});
const TextWithStyles = withTextStyles(RNText);
const TextComponent = forwardRef(({ children, style, ...rest }, ref) => {
    const { debug } = useTheme();
    return (<TextWithStyles {...rest} style={[style, debug ? styles.debug : {}]} ref={ref}>
      {children}
    </TextWithStyles>);
});
export const Text = memo(TextComponent);

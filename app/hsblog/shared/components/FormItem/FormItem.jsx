import React, { memo } from 'react';
import { useTheme } from "../ThemeContext/ThemeContext";
import { Text } from "../Text/Text";
import { View } from "../View/View";
import styles from './styles';
function FormItemComponnent({ label = '', errorMessage = '', required = false, children }) {
    const { styled } = useTheme();
    return (<View style={styles.container}>
      {!!label && (<Text tachyons={['f6', 'mt1']} style={styled.colorDark3}>
          {label} {required && <Text style={styled.colorSecondary}>*</Text>}
        </Text>)}
      {children}
      {!!errorMessage && (<Text tachyons="f6" style={[styled.colorDanger, styles.error]}>
          {errorMessage}
        </Text>)}
    </View>);
}
export const FormItem = memo(FormItemComponnent);

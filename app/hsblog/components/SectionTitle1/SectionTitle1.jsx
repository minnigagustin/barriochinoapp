import React, { memo } from 'react';
import { Text, View, useTheme } from "../../shared";
import styles from './styles';
function SectionTitle1({ text, containerStyle = {}, color = 'primary' }) {
    const { colors } = useTheme();
    return (<View style={[styles.container, containerStyle]}>
      <Text type="h4" style={{ color: colors[color] }}>
        {text}
      </Text>
    </View>);
}
export default memo(SectionTitle1);

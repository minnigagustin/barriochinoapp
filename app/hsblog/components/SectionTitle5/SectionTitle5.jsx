import React, { memo } from 'react';
import { Text, View, useTheme } from "../../shared";
import { Feather } from '@expo/vector-icons';
import styles from './styles';
function SectionTitle5({ text, containerStyle = {}, color = 'primary', arrowRightEnabled = false }) {
    const { colors } = useTheme();
    return (<View style={[styles.container, { borderColor: colors[color] }, containerStyle]}>
      <Text type="h5" style={{ color: colors[color] }}>
        {text}
      </Text>
      {arrowRightEnabled && <Feather name="chevron-right" size={22} color={colors[color]}/>}
    </View>);
}
export default memo(SectionTitle5);

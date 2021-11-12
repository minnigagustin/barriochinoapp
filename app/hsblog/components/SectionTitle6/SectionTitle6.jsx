import React, { memo } from 'react';
import { Text, View, useTheme, Divider } from "../../shared";
import styles from './styles';
function SectionTitle6({ text, containerStyle = {}, color = 'primary' }) {
    const { colors } = useTheme();
    return (<View style={[styles.container, { borderColor: colors.gray2 }, containerStyle]}>
      <Text type="h5" style={{ color: colors[color] }}>
        {text}
      </Text>
      <Divider color="primary" style={styles.divider}/>
    </View>);
}
export default memo(SectionTitle6);

import React, { memo } from 'react';
import { Text, View, useTheme, Divider } from "../../shared";
import styles from './styles';
function SectionTitle2({ text, containerStyle = {}, backgroundColor = 'primary' }) {
    const { colors } = useTheme();
    return (<View style={[styles.container, containerStyle]}>
      <View flexDirection="row">
        <View style={[styles.textWrapper, { backgroundColor: colors[backgroundColor] }]}>
          <Text type="h6" colorNative="#fff">
            {text}
          </Text>
        </View>
      </View>
      <Divider color="primary" style={styles.divider}/>
    </View>);
}
export default memo(SectionTitle2);

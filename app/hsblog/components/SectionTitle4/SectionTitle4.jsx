import React, { memo } from 'react';
import { Text, View, useTheme } from "../../shared";
import styles from './styles';
function SectionTitle4({ text, containerStyle = {}, backgroundColor = 'primary' }) {
    const { colors, styled } = useTheme();
    return (<View tachyons="mb2" style={[styled.bgGray2, containerStyle]}>
      <View flexDirection="row">
        <View justifyContent="center" style={[styles.textWrapper, { backgroundColor: colors[backgroundColor] }]}>
          <Text type="h6" colorNative="#fff">
            {text}
          </Text>
        </View>
        <View style={[styles.triangle, { borderLeftColor: colors[backgroundColor], borderBottomColor: colors[backgroundColor] }]}/>
      </View>
    </View>);
}
export default memo(SectionTitle4);

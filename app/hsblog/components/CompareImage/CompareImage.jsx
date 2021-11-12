import React, { memo } from 'react';
import { Text, View, Image, useTheme } from "../../shared";
import styles from './styles';
const CompareImage = ({ beforeText = 'Before', afterText = 'After', containerStyle = {}, beforeImageUri, afterImageUri }) => {
    const { styled } = useTheme();
    return (<View style={containerStyle}>
      <View style={styles.imageWrap}>
        <Text style={[styles.text, styled.bgDark1, styled.colorGray2]}>{beforeText}</Text>
        <Image uri={beforeImageUri}/>
      </View>
      <View style={styles.imageWrap}>
        <Text style={[styles.text, styled.bgDark1, styled.colorGray2]}>{afterText}</Text>
        <Image uri={afterImageUri}/>
      </View>
    </View>);
};
export default memo(CompareImage);

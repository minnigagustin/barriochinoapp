import React from 'react';
import { View, Text, Image, useTheme } from "../../shared";
import styles from './styles';
const CategoryCard = ({ imageUri, imagePreview, title }) => {
    const { styled } = useTheme();
    return (<View style={[styles.container, styled.bgLight, styled.bGray2]}>
      <Image uri={imageUri} preview={imagePreview} percentRatio="56.25%" containerStyle={styles.image}/>
      <View style={styles.text}>
        <Text type="h7">{title}</Text>
      </View>
    </View>);
};
export default CategoryCard;

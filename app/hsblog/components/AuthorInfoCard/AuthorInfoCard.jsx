import React, { memo } from 'react';
import { Card, Text, View, Icons, useTheme } from "../../shared";
import ImageSmallCard from "../ImageSmallCard/ImageSmallCard";
import { StyleSheet } from 'react-native';
import numberFormat from "../../utils/functions/numberFormat";
const styles = StyleSheet.create({
    imageWrap: { width: '60%' },
});
function AuthorInfoCard({ authorName, authorEmail, authorAvatar, viewTotal, likeTotal, shadow, style, ...rest }) {
    const { sizes } = useTheme();
    return (<Card {...rest} style={style} shadow={shadow} Body={<View flexDirection="row" justifyContent="space-between" alignItems="center">
          <View style={styles.imageWrap}>
            <ImageSmallCard imageUri={authorAvatar} title={authorName} text={authorEmail}/>
          </View>
          <View flexDirection="row" flexWrap="nowrap" alignItems="center">
            <View flexDirection="row" flexWrap="nowrap" alignItems="center">
              <Icons.Feather name="eye" size={sizes.base} color="dark3"/>
              <Text color="dark3"> {numberFormat(viewTotal ?? 0)}</Text>
            </View>
            <View flexDirection="row" flexWrap="nowrap" alignItems="center" tachyons="ml2">
              <Icons.Feather name="heart" size={sizes.base} color="dark3"/>
              <Text color="dark3"> {numberFormat(likeTotal ?? 0)}</Text>
            </View>
          </View>
        </View>}/>);
}
export default memo(AuthorInfoCard);

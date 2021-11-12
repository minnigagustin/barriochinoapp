import React, { memo } from 'react';
import { Image, Text, View, useTheme } from "../../shared";
import { isEmpty } from 'ramda';
import HtmlViewer from "../HtmlViewer/HtmlViewer";
import getHtmlViewerTextStyles from "../../utils/functions/getHtmlViewerTextStyles";
import styles from './styles';
function PostList1({ featuredImage, previewFeaturedImage, title, dateFull = '', excerpt = '', size = 'medium', imageRounded = false, postCategories = [], inverted = false, }) {
    const { colors } = useTheme();
    const imageSize = size === 'medium' ? 120 : 70;
    const FeaturedImage = (<Image preview={previewFeaturedImage} uri={size === 'medium' ? featuredImage?.medium : featuredImage?.thumbnail} width={imageSize} height={imageSize} {...(imageRounded ? { containerStyle: styles.imageRounded } : {})}/>);
    return (<View flexDirection="row">
      {!inverted && FeaturedImage}
      <View tachyons={['flex', 'pv1', 'ph2']} style={inverted ? styles.contentInverted : {}}>
        <Text type="h7" tachyons="mb1" numberOfLines={2}>
          {title}
        </Text>
        {!!excerpt &&
        size === 'medium' &&
        (/<(\|)|>/g.test(excerpt) ? (<HtmlViewer html={excerpt} tagsStyles={getHtmlViewerTextStyles(14, colors.primary)}/>) : (<Text tachyons="mb1" numberOfLines={2}>
              {excerpt}
            </Text>))}
        <View flexDirection="row" alignItems="center">
          {!isEmpty(postCategories) && (<Text key={String(postCategories[0].id)} type="small" style={{ color: postCategories[0].color }}>
              {`${postCategories[0].name}${postCategories.length > 1 ? ` (+${postCategories.length - 1})` : ''}`}
            </Text>)}
          <Text> - </Text>
          {!!dateFull && <Text type="small">{dateFull}</Text>}
        </View>
      </View>
      {inverted && FeaturedImage}
    </View>);
}
export default memo(PostList1);

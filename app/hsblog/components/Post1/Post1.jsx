import React, { memo } from 'react';
import { View, Text, Image, useTheme } from "../../shared";
import { isEmpty } from 'ramda';
import HtmlViewer from "../HtmlViewer/HtmlViewer";
import getHtmlViewerTextStyles from "../../utils/functions/getHtmlViewerTextStyles";
import styles from './styles';
function Post1({ featuredImage, previewFeaturedImage, title, excerpt = '', dateFull = '', type = 'default', size = 'default', imageRounded = false, postCategories = [], }) {
    const { colors } = useTheme();
    return (<View>
      <Image preview={previewFeaturedImage} uri={size === 'default' ? featuredImage?.large : featuredImage?.medium} percentRatio="56.25%" {...(imageRounded ? { containerStyle: styles.imageRounded } : {})}/>
      <View backgroundColor={type === 'default' ? 'transparent' : 'light'} style={styles[type]}>
        <Text type={size === 'small' ? 'h7' : 'h6'} tachyons="mb1" style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {!!excerpt &&
        size === 'default' &&
        (/<(\|)|>/g.test(excerpt) ? (<HtmlViewer html={excerpt} tagsStyles={getHtmlViewerTextStyles(14, colors.primary)}/>) : (<Text tachyons="mb1" numberOfLines={3}>
              {excerpt}
            </Text>))}
        <View flexDirection="row" alignItems="center">
          {size === 'default' && (<>
              {!isEmpty(postCategories) && (<Text key={String(postCategories[0].id)} type="small" style={{ color: postCategories[0].color }}>
                  {`${postCategories[0].name}${postCategories.length > 1 ? ` (+${postCategories.length - 1})` : ''}`}
                </Text>)}
              <Text> - </Text>
            </>)}
          {!!dateFull && <Text type="small">{dateFull}</Text>}
        </View>
      </View>
    </View>);
}
export default memo(Post1);

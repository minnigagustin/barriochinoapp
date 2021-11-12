import * as React from 'react';
import { TouchableOpacity as RNTouchable } from 'react-native';
import { View, Image, Text, withViewStyles } from "../../shared";
import * as WebBrowser from 'expo-web-browser';
import styles from './styles';
const TouchableOpacity = withViewStyles(RNTouchable);
function RestaurantItem({ content, img, newPrice, oldPrice, saleContent, title, link = '' }) {
    const _handleLink = () => {
        !!link && WebBrowser.openBrowserAsync(link);
    };
    return (<TouchableOpacity tachyons={['flexRow', 'justifyBetween']} activeOpacity={1} onPress={_handleLink}>
      <View tachyons={['flexRow']}>
        <View style={styles.image}>
          <Image uri={img} tachyons={['br3', 'absolute', 'z1']} height="100%"/>
        </View>
        <View tachyons={['justifyCenter', 'w60', 'ph2']}>
          <Text size={14} color="dark1" type="h4">
            {title}
          </Text>
          <Text size={12} numberOfLines={1} style={styles.text}>
            {content}
          </Text>
          {!!saleContent && (<View tachyons={['flexWrap']}>
              <View backgroundColor="danger" tachyons={['itemsCenter', 'justifyCenter', 'br2', 'ph2']}>
                <Text size={12} color="light">
                  {saleContent}
                </Text>
              </View>
            </View>)}
        </View>
      </View>
      <View tachyons={['flexRow', 'itemsCenter', 'justifyStart', 'pr2']}>
        <Text size={14} color="dark1">
          {newPrice}
        </Text>
        {!!oldPrice && (<Text size={14} style={styles.lineThrough} color="dark3" tachyons={['ph1']}>
            {oldPrice}
          </Text>)}
      </View>
    </TouchableOpacity>);
}
export default React.memo(RestaurantItem);

import React, { memo } from 'react';
import { FlatList } from 'react-native';
import { View, useTheme } from "../../shared";
import RestaurantItem from './RestaurantItem';
import styles from './styles';
function MenuRestaurant({ menus }) {
    const { colors } = useTheme();
    const _renderRestaurantItem = ({ item, index }) => {
        const style = menus && index === menus.length - 1 ? [] : [styles.item, { borderBottomColor: colors.gray2 }];
        return (<View tachyons={['pb2', 'mb2']} style={style}>
        <RestaurantItem {...item}/>
      </View>);
    };
    return (<View>
      <FlatList data={menus} renderItem={_renderRestaurantItem} keyExtractor={(_item, index) => index.toString() + '___restaurantMenu'} scrollEnabled={false}/>
    </View>);
}
export default memo(MenuRestaurant);

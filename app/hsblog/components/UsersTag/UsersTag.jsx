import React, { memo } from 'react';
import { Easing, Animated, TouchableOpacity } from 'react-native';
import { Text, FlatList, Divider } from "../../shared";
import { usePortalAnimation } from "../../shared/hooks/usePortalAnimation";
import Avatar from "../Avatar/Avatar";
import styles from './styles';
const UsersTag = ({ usersTag = [], visible = false, onPress }) => {
    const { animationStyle, visibleState } = usePortalAnimation({
        visible,
        animationDuration: 200,
        animationType: 'fade',
        animmationEasing: Easing.linear,
    });
    const renderUserItem = ({ item }) => {
        return (<TouchableOpacity style={styles.item} onPress={() => {
            onPress({ id: item.id, text: !!item.name ? item.name : item.displayName });
        }}>
        <Avatar uri={item.avatar} name={!!item.displayName ? item.displayName : 'Wiloke'} size={40}/>
        <Text color="dark2" style={styles.name}>
          {item.displayName}
        </Text>
      </TouchableOpacity>);
    };
    if (!visibleState)
        return null;
    return (<Animated.View style={[styles.container, animationStyle]}>
      <FlatList data={usersTag} renderItem={renderUserItem} keyExtractor={item => item.id.toString()} ItemSeparatorComponent={() => <Divider />} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"/>
    </Animated.View>);
};
export default memo(UsersTag);

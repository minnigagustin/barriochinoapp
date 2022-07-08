import React, { memo } from 'react';
import { View, Text, Icons } from "../../shared";
import Avatar from "../Avatar/Avatar";
import { TouchableOpacity } from 'react-native';
const NotifyCard = ({ avatarUri, name, Message, createAt, iconName, onOption }) => {
    return (<View flexDirection="row" flexWrap="nowrap">
      <View tachyons="mr2">
        <Avatar uri={avatarUri} size={50} name={name}/>
      </View>
      <View flex flexWrap="wrap">
        <View flexDirection="row" flexWrap="nowrap">
          <View flex>
            <Text numberOfLines={2}>
              <Text type="h7">{name}</Text>
              {` `}
              {Message}
            </Text>
            <View flexDirection="row" tachyons="mt1">
              <View tachyons="mr1">
                <Icons.Feather name={iconName} color="primary" size={13}/>
              </View>
              <Text type="small" color="dark3">
                {createAt}
              </Text>
            </View>
          </View>
          <View tachyons="ml1">
            <TouchableOpacity activeOpacity={0.7} onPress={onOption}>
              <View tachyons="pa1">
                <Icons.Feather name="more-horizontal" size={20}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>);
};
export default memo(NotifyCard);

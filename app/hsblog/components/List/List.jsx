import React from 'react';
import { View, Text, Icons } from "../../shared";
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    icon: {
        width: 26,
    },
});
const List = ({ text, iconName, Right = <Icons.Feather name="chevron-right" size={20} color="dark3" style={{ marginRight: -4 }}/>, }) => {
    return (<View flexDirection="row" alignItems="center" justifyContent="space-between" tachyons="pa3">
      <View flexDirection="row" alignItems="center">
        {!!iconName && (<View tachyons="mr1" style={styles.icon}>
            <Icons.Feather name={iconName} size={18} color="dark2"/>
          </View>)}
        <Text>{text}</Text>
      </View>
      {Right}
    </View>);
};
export default List;

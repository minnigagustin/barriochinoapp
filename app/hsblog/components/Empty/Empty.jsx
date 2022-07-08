import React from 'react';
import { View, Text, Icons } from "../../shared";
const Empty = ({ text = 'No data' }) => {
    return (<View alignItems="center" tachyons="pv4">
      <Icons.Feather name="info" color="dark3" size={40}/>
      <View tachyons="mt1">
        <Text>{text}</Text>
      </View>
    </View>);
};
export default Empty;

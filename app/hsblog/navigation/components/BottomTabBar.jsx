import React, { memo } from 'react';
import { View, useTheme } from "../../shared";
import { BottomTabBar as RNBottomTabBar } from 'react-navigation-tabs';
const BottomTabBar = props => {
    const { styled } = useTheme();
    return (<View backgroundColor="light" tachyons="bt" style={styled.bGray3}>
      <RNBottomTabBar {...props}/>
    </View>);
};
export default memo(BottomTabBar);

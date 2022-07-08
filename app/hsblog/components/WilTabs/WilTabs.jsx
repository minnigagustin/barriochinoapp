import React, { useState } from 'react';
import { Text } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { View, useMount, useTheme } from "../../shared";
import { isEmpty } from 'ramda';
import styles from './styles';
export default function WilTabs({ onSwipeStart = () => { }, onSwipeEnd = () => { }, onTabPress = () => { }, onMount = () => { }, renderLazyPlaceholder = () => null, indexActive = 0, tabBarStyles = {}, sceneContainerStyle = {}, tabBarWrapStyle = {}, tabDisabled = false, swipeEnabled = true, data, lazy, renderItem, }) {
    const [indexState, setIndexState] = useState(indexActive);
    const { styled } = useTheme();
    const getNextItemWithIndex = (index) => {
        return index + 1 < data.length ? data[index + 1] : { key: '', title: '' };
    };
    const handleSwipe = (type) => {
        const item = data[indexState];
        const nextItem = getNextItemWithIndex(indexState);
        return () => {
            if (type === 'start') {
                onSwipeStart(item, indexState);
            }
            else {
                onSwipeEnd(item, nextItem, indexState);
            }
        };
    };
    const handleTabPress = (scene) => {
        const index = data.findIndex(item => item.key === scene.route.key);
        const nextItem = getNextItemWithIndex(index);
        onTabPress(scene.route, nextItem, index);
    };
    useMount(() => {
        const item = data[indexState];
        const nextItem = getNextItemWithIndex(indexState);
        onMount(item, nextItem, indexState);
    });
    const renderLabel = ({ route, focused, }) => <Text style={focused ? styled.colorPrimary : styled.colorDark2}>{route.title}</Text>;
    const renderScene = ({ route, }) => {
        const indexFocused = indexState;
        const index = data.findIndex(item => item.key === route.key);
        const nextItem = getNextItemWithIndex(index);
        return renderItem(route, nextItem, index, indexFocused);
    };
    const renderTabBar = (props) => {
        return (<View style={tabBarWrapStyle}>
        <TabBar {...props} scrollEnabled indicatorStyle={styled.bgPrimary} style={styled.bgTransparent} renderLabel={renderLabel} tabStyle={[styles.tabBar, tabBarStyles]} onTabPress={handleTabPress}/>
      </View>);
    };
    if (isEmpty(data)) {
        return null;
    }
    return (<TabView navigationState={{
        index: indexState,
        routes: data,
    }} renderTabBar={!tabDisabled ? renderTabBar : () => null} renderScene={renderScene} renderLazyPlaceholder={renderLazyPlaceholder} onIndexChange={setIndexState} onSwipeStart={handleSwipe('start')} onSwipeEnd={handleSwipe('end')} sceneContainerStyle={sceneContainerStyle} lazy={lazy} swipeEnabled={swipeEnabled}/>);
}

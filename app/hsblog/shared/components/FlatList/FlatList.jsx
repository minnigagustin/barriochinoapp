import React, { useRef, useState } from 'react';
import { FlatList as RNFlatList } from 'react-native';
import { View } from "../View/View";
import { Container } from "../Container/Container";
import { tachyonsStyles as tachyons } from "../../themes/tachyons";
import { useTheme } from "../ThemeContext/ThemeContext";
import isIOS from "../../utils/isIOS";
import { range } from 'ramda';
import { useMount } from "../../hooks/useMount";
export function FlatList({ useContainer = false, renderItem, numColumns = 1, numGap = 16, data, navigation, contentContainerStyle, columnWrapperStyle, horizontal, ListHeaderComponent, ListEmptyComponent, refreshing, onRefresh, onScroll, showsVerticalScrollIndicator = false, showsHorizontalScrollIndicator = false, ...rest }) {
    const { sizes } = useTheme();
    const [stateRefreshing, setStateRefreshing] = useState(false);
    const isTopRef = useRef(false);
    const flatListRef = useRef(null);
    const contentOffsetYRef = useRef(0);
    const ItemWrap = useContainer && numColumns === 1 ? Container : View;
    const ListComponentWrap = useContainer && isIOS ? Container : numColumns > 1 ? View : Container;
    const itemWrapStyle = numColumns > 1 ? { width: `${100 / numColumns}%` } : {};
    const listComponentWrapStyle = isIOS ? {} : numColumns > 1 ? { maxWidth: sizes.container } : {};
    const gapItemStyle = numColumns > 1 ? { paddingHorizontal: numGap / 2 } : {};
    const columnWrapperMaxWidth = sizes.container + (numColumns > 1 ? numGap : 0);
    useMount(() => {
        setStateRefreshing(refreshing);
        !!navigation &&
            navigation.setParams({
                onScrollToTop: () => {
                    if (isTopRef.current && contentOffsetYRef.current === 0) {
                        setStateRefreshing(true);
                        const timeout = setTimeout(() => {
                            onRefresh?.();
                            setStateRefreshing(false);
                            clearTimeout(timeout);
                        }, 400);
                        isTopRef.current = false;
                    }
                    else {
                        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                        isTopRef.current = true;
                    }
                },
            });
    });
    const renderListComponent = (Component) => {
        return (<ListComponentWrap {...(horizontal ? { flex: 1 } : {})} style={listComponentWrapStyle} innerTachyons={isIOS ? 'w100' : 'w100'}>
        {Component}
      </ListComponentWrap>);
    };
    /**
     * renderItemFixed
     * @param index - item index
     * @example
     * [item1] [item2] [item3]
     * [item4] [item5] [item6]
     * [item7] [fixed1] [fixed2]
     */
    const renderItemFixed = (index) => {
        return (!!data &&
            data.length % numColumns !== 0 &&
            index === data.length - 1 &&
            range(0, numColumns - (data.length % numColumns)).map(item => <View key={String(item)} style={[itemWrapStyle, gapItemStyle]}/>));
    };
    const handleScroll = (event) => {
        onScroll?.(event);
        contentOffsetYRef.current = event.nativeEvent.contentOffset.y;
    };
    return (<RNFlatList {...rest} data={data} ref={c => {
        flatListRef.current = c;
    }} numColumns={numColumns} horizontal={horizontal} refreshing={stateRefreshing} onRefresh={onRefresh} onScroll={handleScroll} showsVerticalScrollIndicator={showsVerticalScrollIndicator} showsHorizontalScrollIndicator={showsHorizontalScrollIndicator} ListHeaderComponent={renderListComponent(ListHeaderComponent)} 
    // ListFooterComponent={renderListComponent(ListFooterComponent)}
    ListEmptyComponent={renderListComponent(ListEmptyComponent)} renderItem={info => {
        return (<>
            <ItemWrap style={[itemWrapStyle, gapItemStyle]}>{renderItem?.(info)}</ItemWrap>
            {renderItemFixed(info.index)}
          </>);
    }} {...(useContainer && numColumns > 1
        ? {
            contentContainerStyle: [tachyons.itemsCenter, contentContainerStyle],
            columnWrapperStyle: [{ maxWidth: columnWrapperMaxWidth }, columnWrapperStyle],
        }
        : {
            contentContainerStyle,
            columnWrapperStyle,
        })}/>);
}

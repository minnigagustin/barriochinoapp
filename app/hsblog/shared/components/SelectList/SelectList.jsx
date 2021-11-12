import React from 'react';
import { FlatList } from 'react-native';
import { useSelectList } from "../../hooks/useSelectList";
export function SelectList({ renderItem, onResult, multiple, defaultResult, ...flatListProps }) {
    const { isSelected, onSelect } = useSelectList({
        inputResult: defaultResult,
        multiple,
        onResultCallback: onResult,
    });
    const _renderItem = ({ item, index, separators }) => {
        const selected = isSelected(item);
        return renderItem({ item, index, separators, selected, onSelect });
    };
    return <FlatList {...flatListProps} renderItem={_renderItem}/>;
}
SelectList.defaultProps = {
    multiple: true,
    defaultResult: [],
};

import React, { memo } from 'react';
import { Text } from "../..";
import { isEmpty } from 'ramda';
import { checkInRange, joinStringInArray } from './utils';
function TextHighlight({ value, mentionStyle = {}, entityMap, containerStyle = {}, onPressHighlight, onPressHighlightEnabled = false, }) {
    return (<Text style={containerStyle}>
      {joinStringInArray(value.split('').map((char, index) => {
        for (let i = 0; i < entityMap.length; i++) {
            const condition = checkInRange(index, entityMap[i].range.offset - 1, entityMap[i].range.offset + entityMap[i].range.length) &&
                !!entityMap[i]?.mentions &&
                !isEmpty(entityMap[i].mentions);
            if (condition) {
                return (<Text key={String(index)} style={mentionStyle} onPress={onPressHighlightEnabled ? () => onPressHighlight(entityMap[i]?.mentions) : () => { }}>
                  {char}
                </Text>);
            }
        }
        return char;
    }))}
    </Text>);
}
const typedMemo = memo;
export default typedMemo(TextHighlight);

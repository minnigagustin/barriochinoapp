import React, { forwardRef } from 'react';
import { getTailwindStyle } from "../utils/getTailwindStyle";
import { useTheme } from "../components/ThemeContext/ThemeContext";
import getFlexWrapStyle from "../utils/getFlexWrapStyle";
import getJustifyContentStyle from "../utils/getJustifyContentStyle";
import getFlexStyle from "../utils/getFlexStyle";
import getColumnStyle from "../utils/getColumnStyle";
import getFlexDirectionStyle from "../utils/getFlexDirectionStyle";
import getAlignItemsStyle from "../utils/getAlignItemsStyle";
import { getTachyonsStyle } from "../utils/getTachyonsStyle";
import getDisplayNameHOC from "../utils/getDisplayNameHOC";
export function withViewStyles(Component, styleProp = 'style') {
    const WithViewStyles = forwardRef(({ tailwind = [], tachyons = [], backgroundColor = 'transparent', flex = false, justifyContent, alignItems, flexDirection, column, flexWrap, style = {}, ...rest }, ref) => {
        const { colors } = useTheme();
        const flexStyle = getFlexStyle(flex);
        const justifyContentStyle = getJustifyContentStyle(justifyContent);
        const alignItemsStyle = getAlignItemsStyle(alignItems);
        const flexDirectionStyle = getFlexDirectionStyle(flexDirection);
        const columnStyle = !!column ? getColumnStyle(column) : {};
        const flexWrapStyle = getFlexWrapStyle(flexWrap);
        const inlineStyle = { backgroundColor: !!colors[backgroundColor] ? colors[backgroundColor] : backgroundColor };
        const styles = [
            flexStyle,
            justifyContentStyle,
            alignItemsStyle,
            flexDirectionStyle,
            flexWrapStyle,
            columnStyle,
            inlineStyle,
            getTailwindStyle(tailwind),
            getTachyonsStyle(tachyons),
            style,
        ];
        return <Component ref={ref} {...rest} {...{ [styleProp]: styles }}/>;
    });
    WithViewStyles.displayName = `WithViewStyles(${getDisplayNameHOC(Component)})`;
    return WithViewStyles;
}

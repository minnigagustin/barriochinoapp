import React, { forwardRef } from 'react';
import { getTachyonsStyle } from "../utils/getTachyonsStyle";
import getDisplayNameHOC from "../utils/getDisplayNameHOC";
export function withTachyons(Component, styleProp = 'style') {
    const WithTachyons = forwardRef(({ tachyons = [], style, ...rest }, ref) => {
        return <Component ref={ref} {...rest} {...{ [styleProp]: [getTachyonsStyle(tachyons), style] }}/>;
    });
    WithTachyons.displayName = `WithTachyons ${getDisplayNameHOC(Component)}`;
    return WithTachyons;
}

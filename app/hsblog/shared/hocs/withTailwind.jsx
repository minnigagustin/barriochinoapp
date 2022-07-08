import React, { forwardRef } from 'react';
import { getTailwindStyle } from "../utils/getTailwindStyle";
import getDisplayNameHOC from "../utils/getDisplayNameHOC";
export function withTailwind(Component, styleProp = 'style') {
    const WithTailwind = forwardRef(({ tailwind = [], style, ...rest }, ref) => {
        return <Component ref={ref} {...rest} {...{ [styleProp]: [getTailwindStyle(tailwind), style] }}/>;
    });
    WithTailwind.displayName = `WithTailwind ${getDisplayNameHOC(Component)}`;
    return WithTailwind;
}

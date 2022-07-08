import React, { memo } from 'react';
import { View } from "../..";
import { useTheme } from '../ThemeContext/ThemeContext';
const ContainerComponent = ({ children, safeAreaView, tachyons = [], flex, style, maxWidth, innerTachyons = [] }) => {
    const { sizes } = useTheme();
    return (<View flex={flex} safeAreaView={safeAreaView} tachyons={['itemsCenter', ...(typeof tachyons === 'string' ? [tachyons] : tachyons)]} style={style}>
      <View flex={flex} style={{ maxWidth: maxWidth ?? sizes.container }} tachyons={['w100', ...(typeof innerTachyons === 'string' ? [innerTachyons] : innerTachyons)]}>
        {children}
      </View>
    </View>);
};
export const Container = memo(ContainerComponent);

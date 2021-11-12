import React, { memo } from 'react';
import { View, Text, Image } from "../../shared";
import avatarColors from './avatarColors';
const Avatar = ({ uri, size = 30, name = '' }) => {
    const textSize = size / 2 < 30 ? size / 2 : 30;
    const nameMatch = name.match(/^[^0-9]|\d/g);
    const text = !!name ? (!!nameMatch ? nameMatch[0].toUpperCase() : '') : '';
    const backgroundIndex = Math.floor(text.charCodeAt(0) % avatarColors.length);
    const backgroundColor = avatarColors[backgroundIndex];
    if (!!uri && !uri.includes('https://secure.gravatar.com/avatar/')) {
        return <Image uri={uri} preview={uri} width={size} percentRatio="100%" borderRadius="pill"/>;
    }
    return (<View justifyContent="center" alignItems="center" tachyons="brPill" style={{ backgroundColor, width: size, height: size }}>
      {!!name && (<Text size={textSize} style={{ lineHeight: textSize * 2, color: '#fff' }}>
          {text}
        </Text>)}
    </View>);
};
export default memo(Avatar);

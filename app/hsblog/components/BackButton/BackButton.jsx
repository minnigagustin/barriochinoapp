import React, { memo } from 'react';
import { Link } from "../../navigation";
import { Icons, Text, useTheme } from "../../shared";
import styles from './styles';
const BackButton = ({ backText = '', color = 'dark1', containerStyle = {}, onAfterBack, ...rest }) => {
    const { sizes, colors } = useTheme();
    return (<Link {...rest} to="../" activeOpacity={0.7} style={[styles.container, containerStyle]} onAfterNavigate={onAfterBack}>
      <Icons.Feather name="chevron-left" size={sizes.base * 1.8} color={color}/>
      {!!backText && (<Text tachyons="f6" style={{ color: colors[color] }}>
          {backText}
        </Text>)}
    </Link>);
};
export default memo(BackButton);

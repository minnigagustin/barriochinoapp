import React from 'react';
import { Text, View } from "../../shared";
import Avatar from "../Avatar/Avatar";
const ImageSmallCard = ({ imageUri, title = '', text = '', containerStyle = {} }) => {
    return (<View flexDirection="row" alignItems="center" style={containerStyle}>
      {<Avatar uri={imageUri ?? ''} size={40} name={title}/>}
      <View flex tachyons="ml1">
        {!!title && (<Text type="h7" numberOfLines={1}>
            {title}
          </Text>)}
        {!!text && (<Text type="small" color="dark3" numberOfLines={1}>
            {text}
          </Text>)}
      </View>
    </View>);
};
export default ImageSmallCard;

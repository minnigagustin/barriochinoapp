import React, { useState, memo } from 'react';
import { TouchableOpacity, Linking, Platform } from 'react-native';
import { Icons, View, Image } from "../../shared";
import styles from './styles';
const Video = ({ percentRatio = `${(9 / 16) * 100}%`, uri, style, thumbnailUri, thumbnailPreview, tachyons }) => {
    const [width, setWidth] = useState(0);
    const sizePlayButton = width / 4 < 60 ? width / 4 : 60;
    const handlePress = async () => {
        try {
            const videoId = uri.replace(/^.*(\?v=|youtu\.be)/g, '');
            const iosLinking = `vnd.youtube://${videoId}`;
            const androidLinking = `intent://${uri}#Intent;package=com.google.android.youtube;scheme=https;end`;
            await Linking.openURL(Platform.OS === 'ios' ? iosLinking : androidLinking);
        }
        catch {
            Linking.openURL(uri);
        }
    };
    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
    };
    return (<View onLayout={handleLayout} style={[styles.container, style]} tachyons={tachyons}>
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handlePress}>
        <Image uri={thumbnailUri} preview={thumbnailPreview} percentRatio={percentRatio}/>
        <View tachyons={['absolute', 'absoluteFill', 'z1', 'itemsCenter', 'justifyCenter']} style={styles.overlay}>
          <View style={[
        styles.iconWrap,
        {
            width: sizePlayButton,
            height: sizePlayButton,
            borderRadius: sizePlayButton / 2,
        },
    ]}>
            <Icons.Feather name="play" size={sizePlayButton / 2.2} colorNative="#fff" style={styles.icon}/>
          </View>
        </View>
      </TouchableOpacity>
    </View>);
};
export default memo(Video);

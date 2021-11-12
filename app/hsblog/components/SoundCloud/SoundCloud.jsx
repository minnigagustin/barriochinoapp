import React from 'react';
import { WebView } from 'react-native-webview';
import { View, withViewStyles, useTheme } from "../../shared";
import { styles } from './styles';
const SoundCloud = ({ uri, ...rest }) => {
    const { styled } = useTheme();
    return (<View {...rest}>
      <WebView injectedJavaScript={`
        document.body.scrollHeight;
      `} source={{
        uri: `https://w.soundcloud.com/player/?url=${uri}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=true`,
    }} style={[styled.bgGray1, styles.webview]}/>
    </View>);
};
export default withViewStyles(SoundCloud);

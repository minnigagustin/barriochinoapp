import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import { Layout } from "../../dumbs";
import ContentWebView from "./ContentWebView";
import useWebViewLoadEnd from "./useWebViewLoadEnd";
import useWebViewMessage from "./useWebViewMessage";

const PageScreen2 = ({ navigation, settings }) => {
  const { params } = navigation.state;
  const { uri, titleitem } = params;
  const { webViewRef, onLoadEnd } = useWebViewLoadEnd(navigation);
  const { title, onMessage } = useWebViewMessage(navigation);

  return (
    <Layout
      navigation={navigation}
      headerType="headerHasBack"
      title={titleitem || "Pide tu Delivery PaYa!"}
      goBack={() => navigation.goBack()}
      renderRight={() => (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <Feather name="search" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      renderContent={() => (
        <ContentWebView
          navigation={navigation}
          webViewRef={webViewRef}
          onLoadEnd={onLoadEnd}
          onMessage={onMessage}
        />
      )}
      colorPrimary={settings.colorPrimary}
      scrollViewEnabled={false}
    />
  );
};
const mapStateToProps = (state) => ({
  settings: state.settings,
});
export default connect(mapStateToProps)(PageScreen2);

import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { bottomBarHeight, WithLoading } from "../../../wiloke-elements";

const webviewCss = `
  .wil-section {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }
  body {
    padding-bottom: ${bottomBarHeight}px;
  }
  #wil-edit-listing-btn {
    visibility: hidden;
    opacity: 0;
  }
  .listing-detail_module__2-bfH {
    visibility: hidden;
    opacity: 0;
  }
  #wilcity-header-section,
  [class^="footer_module__"],
  #wpadminbar {
    display: none !important;
  }
  html {
    margin-top: 0 !important;
  }
`;

const ContentWebView = ({ navigation, webViewRef, onMessage, onLoadEnd }) => {
  const { params } = navigation.state;
  const { uri } = params;

  return (
    <View style={{ flex: 1 }}>
      { /* <ViewWithLoading isLoading={isLoading} /> */ }
      <WebView
        decelerationRate="normal"
        ref={webViewRef}
        source={{
          uri,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        originWhitelist={["*"]}
        showsVerticalScrollIndicator={false}
        startInLoadingState
        useWebKit
        javaScriptEnabled
        injectedJavaScript={`
          document.head.insertAdjacentHTML('beforeend', '<style>${webviewCss
            .replace(/\n/g, "")
            .replace(/\s+/g, " ")}</style>');
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mounted', payload: { title: document.title } }));
        `}
        onLoadEnd={onLoadEnd}
        onMessage={onMessage}
      />
    </View>
  );
};

export default ContentWebView;

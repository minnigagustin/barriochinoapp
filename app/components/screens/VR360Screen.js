import React, { Component } from "react";
import { View, Text } from "react-native";
import WebView from "react-native-webview";
import { screenHeight } from "../../constants/styleConstants";
import Constants from "expo-constants";

export default class VR360Screen extends Component {
  _handleLoadEndForWiloke = () => {
    const css = `
      .ipnrm-navigation {
        top: auto !important;
        left: auto !important;
        bottom: 0 !important;
        right: 42px !important;
      }
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-audio-player .ipnrm-volume,
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-btn {
        width: 28px !important;
        height: 28px !important;
      }
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-btn:hover {
        background-color: transparent !important;
      }
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-audio-player .ipnrm-volume:after {
        height: 18px !important;
      }
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-btn.ipnrm-scene-list {
        transform: scale(1.3);
        background-color: transparent !important;
      }
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-scene-list-data .ipnrm-scene-list-item {
        height: 36px;
        line-height: 36px;
      }
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-scene-list-head,
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-scene-list {
        top: ${Constants.statusBarHeight + 5}px !important;
      }
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-scene-list-data {
        top: ${Constants.statusBarHeight + 29}px !important;
      }
    `;
    this.webview.injectJavaScript(`
      document.head.insertAdjacentHTML('beforeend', '<style>${css
        .replace(/\n/g, "")
        .replace(/\s+/g, " ")}</style>');
      const timeId = setTimeout(() => {
        const fullScreenEl = document.querySelector('.ipnrm-fullscreen');
        if (!fullScreenEl.className.includes('ipnrm-active')) {
          fullScreenEl.click();
        }
        fullScreenEl.addEventListener('click', () => {
          clearTimeout(timeId);
          window.ReactNativeWebView.postMessage('');
        });
      }, 1000);
    `);
  };

  _handleLoadEnd = () => {
    this.webview.injectJavaScript(`
      const fullScreenEl = document.querySelector('.full-screen-button');
      const closeEl = document.querySelector('.right-button-wrapper .close-button');
      fullScreenEl.click();
      closeEl.addEventListener('click', () => {
        window.ReactNativeWebView.postMessage('');
      });
    `);
  };

  _handleMessage = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const { navigation } = this.props;
    const { params } = navigation.state;
    return (
      <View style={{ height: screenHeight }}>
        <WebView
          ref={(c) => (this.webview = c)}
          source={{
            uri: params.vr360Url,
          }}
          style={{ width: "100%", height: "100%" }}
          originWhitelist={["*"]}
          startInLoadingState={true}
          showsVerticalScrollIndicator={false}
          useWebKit
          javaScriptEnabled
          onLoadEnd={this._handleLoadEnd}
          onMessage={this._handleMessage}
        />
      </View>
    );
  }
}

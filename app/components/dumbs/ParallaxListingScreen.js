import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Animated, Image, StyleSheet, Dimensions } from "react-native";
import { ParallaxScreen, ImageCover, Loader } from "../../wiloke-elements";
import Heading from "./Heading";
import WebView from "react-native-webview";
import Constants from "expo-constants";

const LOGO_SIZE = 80;
const WAVE_SIZE = 168;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default class ParallaxListingScreen extends Component {
  static propTypes = {
    renderContent: PropTypes.func,
    logo: PropTypes.string,
    title: PropTypes.string,
    tagline: PropTypes.string,
    renderNavigation: PropTypes.func,
  };

  static defaultProps = {
    renderContent: () => {},
    renderNavigation: () => {},
  };

  state = {
    scrollY: new Animated.Value(0),
    headerMaxHeight: 0,
    headerMinHeight: 0,
  };

  _handleGetScrollYAnimation = (scrollY, headerMeasure) => {
    const { headerMaxHeight, headerMinHeight } = headerMeasure;
    this.setState({ scrollY, headerMaxHeight, headerMinHeight });
  };

  _getHeaderDistance = () => {
    const { headerMaxHeight, headerMinHeight } = this.state;
    return headerMaxHeight - headerMinHeight;
  };

  _getLogoWrapperInnerStyle = () => {
    const { scrollY } = this.state;
    const scale = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    const opacity = scrollY.interpolate({
      inputRange: [this._getHeaderDistance(), this._getHeaderDistance() + 1],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return {
      transform: [{ scale }],
      opacity,
    };
  };

  _getLogoWrapperStyle = () => {
    const { scrollY, headerMinHeight } = this.state;
    const opacity = scrollY.interpolate({
      inputRange: [headerMinHeight, headerMinHeight + 1],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return { opacity: 1 };
  };

  _handleMessage = () => {
    const { vr360Url, navigation } = this.props;
    if (!vr360Url.includes("360tourcreator.com")) {
      navigation.navigate("VR360Screen", {
        vr360Url,
      });
    }
  };

  _handleLoadEndForWiloke = () => {
    const css = `
      .ipnrm-navigation {
        top: auto !important;
        left: auto !important;
        bottom: 0 !important;
        right: 5px !important;
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
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-fullscreen {
        display: none !important;
      }

      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-btn.ipnrm-scene-list {
        transform: scale(1.3);
        background-color: transparent !important;
      }
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-scene-list-data .ipnrm-scene-list-item {
        height: 36px;
        line-height: 36px;
        left: 0 !important;
      }
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-scene-list {
        top: auto !important;
        bottom: 5px !important;
        left: 42px !important;
        background-color: transparent !important;
      }
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-scene-list-data {
        top: auto !important;
        bottom: 35px !important;
        left: 44px !important;
      }
      .ipnrm.ipnrm-scene-active.ipnrm-widget-list .ipnrm-scene-list-head {
        display: none !important;
      }
    `;

    this.webview.injectJavaScript(`
      document.head.insertAdjacentHTML('beforeend', '<style>${css
        .replace(/\n/g, "")
        .replace(/\s+/g, " ")}</style>');

        const timeId1 = setTimeout(() => {
        const fullScreenEl = document.querySelector('.ipnrm-fullscreen');
        fullScreenEl.addEventListener('click', () => {
          clearTimeout(timeId1);
          const timeId = setTimeout(() => {
            fullScreenEl.click();
            window.ReactNativeWebView.postMessage('');
            clearTimeout(timeId);
          });
        });
      }, 1000);
    `);
  };

  _handleLoadEnd = () => {
    this.webview.injectJavaScript(`
      const fullScreenEl = document.querySelector('.full-screen-button');
      const closeEl = document.querySelector('.right-button-wrapper .close-button');
      fullScreenEl.addEventListener('click', () => {
        const timeId = setTimeout(() => {
          closeEl.click();
          window.ReactNativeWebView.postMessage('');
          clearTimeout(timeId);
        });
      });
    `);
  };

  renderAfterImage = () => {
    const { vr360Url } = this.props;
    return (
      <Animated.View
        style={[styles.logoWrapper, this._getLogoWrapperInnerStyle()]}
      >
        <Animated.View style={[styles.logoWrapInner]}>
          <ImageCover
            src={this.props.logo}
            width={LOGO_SIZE}
            borderRadius={LOGO_SIZE / 2}
            styles={styles.logo}
          />
          <Image
            source={require("../../../assets/wave.png")}
            style={styles.wave}
          />
        </Animated.View>
      </Animated.View>
    );
  };

  renderContent = () => {
    const { title, tagline } = this.props;
    return (
      <View style={{ paddingTop: 8 }}>
        <Heading
          title={title}
          text={tagline}
          titleSize={16}
          align="center"
          style={{ paddingHorizontal: 15 }}
        />
        <View style={{ height: 10 }} />
        {this.props.renderContent()}
      </View>
    );
  };

  _renderReplaceImage = () => {
    const { vr360Url } = this.props;
    if (!vr360Url) {
      return null;
    }
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: "#eee" }}>
        <WebView
          ref={(c) => (this.webview = c)}
          source={{
            uri: vr360Url,
          }}
          style={{ width: "100%", height: "100%" }}
          originWhitelist={["*"]}
          startInLoadingState={true}
          showsVerticalScrollIndicator={false}
          useWebKit
          javaScriptEnabled
          onLoadEnd={
            vr360Url.includes("360tourcreator.com")
              ? this._handleLoadEndForWiloke
              : this._handleLoadEnd
          }
          onMessage={this._handleMessage}
        />
      </View>
    );
  };

  render() {
    const { vr360Url } = this.props;
    return (
      <View style={styles.container}>
        <ParallaxScreen
          {...this.props}
          renderAfterImage={this.renderAfterImage}
          renderContent={this.renderContent}
          onGetScrollYAnimation={this._handleGetScrollYAnimation}
          afterImageMarginTop={-40}
          renderReplaceImage={this._renderReplaceImage}
          overlayDarkEnabled={!vr360Url}
        />
        {this.props.renderNavigation()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: SCREEN_HEIGHT,
    flex: 1,
  },
  logoWrapper: {
    position: "relative",
    alignItems: "center",
    zIndex: 9999,
  },
  logoWrapInner: {
    position: "relative",
    width: LOGO_SIZE,
  },
  logo: {
    marginTop: 4,
  },
  wave: {
    position: "absolute",
    top: 0,
    left: -WAVE_SIZE / 2 + LOGO_SIZE / 2,
    tintColor: "#fff",
    width: WAVE_SIZE,
    height: (WAVE_SIZE * 131) / 317,
  },
});

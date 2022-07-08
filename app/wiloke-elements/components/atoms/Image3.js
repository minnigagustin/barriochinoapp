import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image as RNImage } from "react-native";
import PropTypes from "prop-types";
import { Feather } from "@expo/vector-icons";

const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9JREFUeNpifvfuHUCAAQAFpALOO255kgAAAABJRU5ErkJggg==";
export default class Image3 extends PureComponent {
  static propTypes = {
    uri: PropTypes.string,
    preview: PropTypes.string,
    percentRatio: PropTypes.string,
    containerStyle: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    loading: PropTypes.bool,
  };

  static defaultProps = {
    uri: DEFAULT_IMAGE,
    preview: DEFAULT_IMAGE,
    percentRatio: "",
    loading: false,
  };

  constructor(props) {
    super(props);
    this._req = -1;
    this.state = {
      percentRatioState: props.percentRatio || "75%",
      isPreviewLoaded: false,
      isUriLoaded: false,
    };
  }

  componentDidMount() {
    const { percentRatio } = this.props;
    if (!!percentRatio) {
      this.setState({
        percentRatioState: percentRatio,
      });
    }
  }

  componentWillUnmount() {
    this._req && cancelAnimationFrame(this._req);
  }

  _handleGetImageSuccess = (width, height) => {
    this.setState({
      percentRatioState: `${(height / width) * 100}%`,
    });
  };

  _handleGetImageFailure = () => {
    this._req && cancelAnimationFrame(this._req);
  };

  _handleLoadEnd = () => {
    const { percentRatio, uri } = this.props;
    if (!percentRatio) {
      this._req = requestAnimationFrame(() => {
        RNImage.getSize(
          uri,
          this._handleGetImageSuccess,
          this._handleGetImageFailure
        );
      });
    }
    this.setState({
      isUriLoaded: true,
    });
  };

  _handlePreviewLoadEnd = () => {
    this.setState({
      isPreviewLoaded: true,
    });
  };

  render() {
    const { containerStyle, width, height, preview, uri, loading } = this.props;
    const { isPreviewLoaded, isUriLoaded, percentRatioState } = this.state;
    return (
      <View
        style={[
          styles.container,
          containerStyle,
          !!width ? { width } : {},
          !!height ? { height } : {},
        ]}
      >
        {!height && (
          <View
            style={[styles.percentView, { paddingTop: percentRatioState }]}
          />
        )}
        {!loading && !!preview && !isUriLoaded && (
          <RNImage
            source={{ uri: preview }}
            resizeMode="cover"
            style={styles.previewImage}
            onLoadEnd={this._handlePreviewLoadEnd}
            blurRadius={1}
          />
        )}
        {!loading && isPreviewLoaded && !!uri && (
          <RNImage
            {...this.props}
            resizeMode="cover"
            source={{ uri }}
            style={styles.image}
            onLoadEnd={this._handleLoadEnd}
          />
        )}
        {loading && (
          <View style={styles.previewImage}>
            <Feather name="image" size={50} color="gray1" />
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  percentView: {
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
});

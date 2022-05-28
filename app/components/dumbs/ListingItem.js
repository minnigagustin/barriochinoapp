import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ViewPropTypes,
} from "react-native";
import { Feather, AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import _ from "lodash";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import Heading from "./Heading";
import {
  IconTextSmall,
  ImageCover,
  mapDistance,
  Image2,
} from "../../wiloke-elements";
import Rated from "./Rated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH_HORIZONTAL = (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) / 1.8;
const ITEM_WIDTH_VERTICAL = (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) / 2 - 15;
const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9JREFUeNpifvfuHUCAAQAFpALOO255kgAAAABJRU5ErkJggg==";

export default class ListingItem extends PureComponent {
  static propTypes = {
    layout: PropTypes.oneOf(["vertical", "horizontal"]),
    image: PropTypes.string,
    logo: PropTypes.string,
    name: PropTypes.string,
    tagline: PropTypes.string,
    location: PropTypes.string,
    phone: PropTypes.string,
    reviewMode: PropTypes.number,
    reviewAverage: PropTypes.number,
    businessStatus: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.objectOf(PropTypes.string),
      PropTypes.string,
    ]),
    onPress: PropTypes.func,
    colorPrimary: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    featureImageWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    mapDistance: PropTypes.string,
    claimStatus: PropTypes.bool,
  };
  static defaultProps = {
    contentLoader: false,
    colorPrimary: Consts.colorPrimary,
    isFooterAutoDisable: true,
    mapDistance: "",
    claimStatus: false,
  };

  renderRated() {
    const { reviewMode, reviewAverage } = this.props;
    return (
      <Rated
        rate={reviewAverage}
        max={reviewMode}
        rateStyle={{ fontSize: 13, marginRight: 2 }}
        maxStyle={{ fontSize: 9 }}
      />
    );
  }

  renderVerified = () => {
    const { translations, colorPrimary } = this.props;
    return (
      <View
        style={[
          styles.claim,
          {
            backgroundColor: colorPrimary,
          },
        ]}
      >
        <View
          style={[
            styles.before,
            { borderTopColor: colorPrimary, borderBottomColor: colorPrimary },
          ]}
        />
        <Text style={styles.claimText}>{translations.verfied}</Text>
        <View style={[styles.after, { borderTopColor: colorPrimary }]} />
        <View style={[styles.after, { borderTopColor: "rgba(0,0,0,0.3)" }]} />
      </View>
    );
  };

  renderImage() {
    const { layout, image, featureImageWidth } = this.props;

    return (
      <ImageCover
        src={!!image ? encodeURI(image) : DEFAULT_IMAGE}
        // preview={image}
        width={
          !!featureImageWidth
            ? featureImageWidth
            : layout === "horizontal"
            ? ITEM_WIDTH_HORIZONTAL
            : ITEM_WIDTH_VERTICAL
        }
        modifier="16by9"
        borderRadius={10}
        overlay={0.55}
        blurRadius={0.5}


      />
    );
  }
  _renderBusinessText = (status) => {
    const { translations } = this.props;
    switch (status) {
      case true:
        return translations.open;
      case "day_off":
        return translations.dayOff;
      case "business_closures":
        return translations.businessClosures;
      case "always_open":
        return translations.always_open;
      case "no_hours_available":
      case null:
        return null;
      default:
        return translations.closed;
    }
  };

  renderFooter = () => {
    const { businessStatus, translations } = this.props;
    return (
      <View style={styles.footer}>
        {this.renderRated()}
        <View style={{left: 5}}>
        <Entypo name="star" size={15} color="#FFDC00" />
        </View>

      </View>
    );
  };

  renderVerified = () => {
    const { translations, colorPrimary } = this.props;
    return (
      <View
        style={[
          styles.claim
        ]}
      >

        <FontAwesome name="check" size={18} color="black" />

      </View>
    );
  };

  renderAbierto = () => {
    const {
      businessStatus
    } = this.props;
    return (
      <View style={styles.abierto}>
          <Text
          style={{
            fontSize: 11,
            color:
              !businessStatus ||
              businessStatus === "day_off" ||
              businessStatus === "close" ||
              businessStatus === "business_closures"
                ? Consts.colorQuaternary
                : '#FFDC00',
          }}
        >
          {this._renderBusinessText(businessStatus)}
        </Text>
        </View>
    );
  };

  renderContent = () => {
    const {
      businessStatus,
      reviewAverage,
      isFooterAutoDisable,
      location,
      logo,
      onPress,
      title,
      tagline,
      colorPrimary,
      mapDistance,
      claimStatus,
    } = this.props;
    const footerCondition = !isFooterAutoDisable || !!reviewAverage;
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <View style={{ position: "relative" }}>
          <View style={styles.wrap}>
          {this.renderAbierto()}
            {this.renderImage()}
            {!!mapDistance && (
              <View
                style={[
                  styles.mapDistance,
                  {
                    backgroundColor: Consts.colorSecondary,
                  },
                ]}
              >
                <Text style={styles.mapDistanceText}>{mapDistance.toFixed(2) + 'km'}</Text>
              </View>
              )}
            <View style={styles.logoWrap}>
              <ImageCover
                src={logo}
                width={30}
                styles={styles.logo}
                borderRadius={15}
              />

            </View>
          </View>
          {claimStatus && this.renderVerified()}

          <View style={styles.footer}>
            <Heading
              title={title}
              titleSize={10}
              textSize={9}
              titleColor="#FFFFFF"
              titleNumberOfLines={2}
              textNumberOfLines={1}
            />
            {this.renderFooter()}

          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { layout, containerStyle } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            width:
              layout === "horizontal"
                ? ITEM_WIDTH_HORIZONTAL
                : ITEM_WIDTH_VERTICAL,
          },
          containerStyle,
        ]}
      >
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: Consts.round,
    margin: 5,
  },
  logoWrap: {
    position: "relative",
    zIndex: 9,
    marginTop: -55.5,
    marginLeft: 0,
    marginBottom: -5,
    width: 66,
  },
  wave: {
    width: 66,
    height: (66 * 131) / 317,
    position: "absolute",
    zIndex: -1,
    top: 0,
    left: 0,
  },
  logo: {
    marginLeft: 18,
    marginTop: 2,
    marginBottom: 5
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    zIndex: 9,
    marginTop: 2,
    marginLeft: 5,
    marginRight: 5

  },
  textWrap: { marginRight: 10, marginTop: 2 },
  pd: { paddingTop: 10, paddingBottom: 10 },
  wrap: {
    position: "relative",
  },
  mapDistance: {
    position: "absolute",
    zIndex: 9,
    top: 10,
    marginLeft: 75,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: Consts.round,
  },
  mapDistanceText: {
    color: "#fff",
    fontSize: 13,
  },
  claim: {
    position: "absolute",
    top: 10,
    backgroundColor: '#FFDC00',
    right: 5,
    padding: 4,
    borderRadius: 50,

    zIndex: 9999,
  },
  abierto: {
    position: "absolute",
    top: 10,
    backgroundColor: 'black',
    left: 5,
    padding: 4,
    borderRadius: 50,

    zIndex: 9999,
  },
  claimText: {
    width: 30,
    height: 30
  },
  after: {
    position: "absolute",
    height: 0,
    width: 0,
    bottom: -5,
    right: 0,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderRightColor: "transparent",
  },
  before: {
    position: "absolute",
    height: 0,
    width: 0,
    top: 0,
    left: -10,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 10,
    borderRightColor: "transparent",
    borderLeftWidth: 10,
    borderLeftColor: "transparent",
  },
});

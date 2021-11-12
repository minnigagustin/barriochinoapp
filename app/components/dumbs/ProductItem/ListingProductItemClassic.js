import React, { PureComponent } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
// import { Image } from "react-native-expo-image-cache";
import {
  FontIcon,
  HtmlViewer,
  CheckBox,
  Image2,
} from "../../../wiloke-elements";
// import { colorPrimary } from "../../../constants/styleConstants";
import TextDecode from "../TextDecode/TextDecode";

export default class ListingProductItemClassic extends PureComponent {
  static propTypes = {
    src: PropTypes.string,
    productName: PropTypes.string,
    priceHtml: PropTypes.string,
    salePriceHtml: PropTypes.string,
    onPress: PropTypes.func,
    category: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.string,
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    colorPrimary: PropTypes.string,
    checkbox: PropTypes.bool,
    onChecked: PropTypes.func,
    isLoggedIn: PropTypes.bool,
  };
  static defaultProps = {
    checkbox: false,
    onChecked: () => {},
  };
  constructor(props) {
    super(props);
    const { checked } = props;
    this.state = {
      checked,
    };
  }

  // _handlePressCheck = async (name, checked) => {
  //   const { onChecked, isLoggedIn } = this.props;
  //   if (!isLoggedIn) {
  //     onChecked(false);
  //     return;
  //   }

  //   await this.setState({
  //     checked: !this.state.checked
  //   });
  //   onChecked && onChecked(this.state.checked);
  // };

  renderCheckBox = () => {
    const { isLoggedIn } = this.props;
    const { checked } = this.state;
    return (
      <View>
        <CheckBox
          checked={isLoggedIn ? checked : false}
          size={22}
          borderWidth={1}
          radius={100}
          name="checkbox"
          // condition={!isLoggedIn}
          // onPress={this._handlePressCheck}
          circleAnimatedSize={0}
          disabled={true}
        />
      </View>
    );
  };

  renderOutOfStock = () => {
    const { statusText } = this.props;
    return (
      <View style={styles.outStock}>
        <Text style={{ fontSize: 22, color: "red", paddingHorizontal: 3 }}>
          {statusText}
        </Text>
      </View>
    );
  };

  render() {
    const {
      src,
      productName,
      priceHtml,
      salePriceHtml,
      onPress,
      category,
      author,
      salePrice,
      status,
      colorPrimary,
      checkbox,
    } = this.props;
    const preview = {
      uri: src,
    };
    const uri = src;
    return (
      <View style={styles.container}>
        <View style={{ paddingVertical: 5, flexDirection: "row" }}>
          <View style={styles.logo}>
            <Image2
              containerStyle={styles.images}
              width="100%"
              percentRatio="100%"
              uri={uri}
            />
          </View>
          <View style={styles.infoProduct}>
            <TextDecode
              text={productName}
              style={styles.name}
              numberOfLines={2}
              ellipsizeMode="tail"
              onPress={onPress}
            />
            <View
              style={
                !!salePriceHtml && {
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }
              }
            >
              {!!salePriceHtml && (
                <HtmlViewer
                  html={salePriceHtml}
                  containerStyle={{
                    padding: 0,
                    paddingRight: 5,
                  }}
                  htmlWrapCssString={`color: ${colorPrimary}; font-size: 12px;`}
                />
              )}
              <HtmlViewer
                html={priceHtml}
                containerStyle={{
                  padding: 0,
                }}
                htmlWrapCssString={
                  !!salePriceHtml
                    ? `text-decoration-line: line-through; color:#e5e5e5; font-size: 12px;`
                    : `color: ${colorPrimary}, font-size: 12px;`
                }
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.text}>{author}</Text>
              <Text style={styles.text}>{category}</Text>
            </View>
          </View>
        </View>
        {status === "outofstock" && this.renderOutOfStock()}
        {/* {checkbox && this.renderCheckBox()} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  infoProduct: {
    paddingLeft: 10,
  },
  name: {
    fontSize: 12,
    color: "#333",
    flexWrap: "wrap",
    maxWidth: "100%",
    fontWeight: "bold",
    paddingVertical: 3,
    textTransform: "uppercase",
  },
  text: {
    fontSize: 12,
    color: "#222",
    paddingRight: 5,
  },
  images: {
    borderRadius: 5,
  },
  outStock: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 150,
    height: 40,
    zIndex: -1,
    marginTop: -20,
    marginLeft: 40,
    opacity: 0.7,
    borderWidth: 1,
    borderColor: "red",
    transform: [
      {
        rotate: "-20deg",
      },
    ],
    alignItems: "center",
  },
});

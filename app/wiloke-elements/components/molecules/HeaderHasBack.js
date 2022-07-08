import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Image
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Consts from "../../../constants/styleConstants";
import stylesBase from "../../../stylesBase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ICON_WIDTH = 50;
const ICON_HEIGHT = 30;
const PADDING_HORIZONTAL = 10;

export default class HeaderHasBack extends PureComponent {
  static propTypes = {
    renderRight: PropTypes.func,
    goBack: PropTypes.func,
    renderCenter: PropTypes.func,
    goBackIconName: PropTypes.string,
    title: PropTypes.string,
    headerBackgroundColor: PropTypes.string,
    headerHeight: PropTypes.number,
  };

  static defaultProps = {
    renderRight: () => <Text />,
    goBackIconName: "chevron-left",
    headerBackgroundColor: Consts.colorPrimary,
    headerHeight: 52,
    tintColor: "#fff",
  };

  render() {
let logotitle;
if(this.props.title === 'Vegan'){
  logotitle = <Image
      style={{width: 100, height: 20}}
      source={{uri: 'https://enelbarriochino.com/wp-content/uploads/vector-vegan-4.png.webp'}}
    />;
} else if(this.props.title === 'Kosher'){
  logotitle = <Image
      style={{width: 100, height: 20}}
      source={{uri: 'https://enelbarriochino.com/wp-content/uploads/Kosher-2-2.png.webp'}}
    />;
  } else if(this.props.title === 'Barrio Chino'){
    logotitle = <Image
      style={{width: 70, height: 30}}
      source={{uri: 'https://enelbarriochino.com/wp-content/uploads/2021/04/bc-logo-4.png.webp'}}
    />;
  } else {
  logotitle = <Text
              style={[
                stylesBase.h5,
                { color: this.props.tintColor, fontWeight: "500" },
              ]}
              numberOfLines={1}
            >
              {this.props.title}
            </Text>
}

    return (
      <View
        style={[
          styles.container,
          {
            height: this.props.headerHeight + Constants.statusBarHeight,
            backgroundColor: this.props.headerBackgroundColor,
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={this.props.goBack}>
          <View
            style={[
              styles.icon,
              {
                alignItems: "flex-start",
              },
            ]}
          >
            <Feather
              name={this.props.goBackIconName}
              size={26}
              color={this.props.tintColor}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: SCREEN_WIDTH - (ICON_WIDTH + PADDING_HORIZONTAL) * 2,
            alignItems: "center",
          }}
        >
          {this.props.renderCenter ? (
            this.props.renderCenter()
          ) : (
          <View>
            {logotitle}
            </View>
          )}
        </View>
        <View
          style={[
            styles.icon,
            {
              alignItems: "flex-end",
            },
          ]}
        >
          {this.props.renderRight()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop: Constants.statusBarHeight,
  },
  icon: {
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
});

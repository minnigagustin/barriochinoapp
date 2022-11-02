import React, { PureComponent } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import { Image2, FontIcon } from "../../../wiloke-elements";
import { colorPrimary } from "../../../constants/styleConstants";
import he from "he";

export default class CategorySelectItem extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    isSelected: PropTypes.bool,
    item: PropTypes.object,
  };

  state = {
    animatedValue: new Animated.Value(0),
  };

  _scaleStyle = () => {
    const { animatedValue } = this.state;
    const scale = animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 1.2],
    });
    return { scale };
    // const fontSize = animatedValue.interpolate({
    //   inputRange: [0, 100],
    //   outputRange: [12, 14],
    // });
  };

  _renderImage = () => {
    const { item } = this.props;
    if (item.oIcon.type === "image") {
      return (
        <Image2
          uri={item.oIcon.url}
          preview={item.oIcon.url}
          width="100%"
          percentRatio="100%"
          containerStyle={{ borderRadius: item.oTerm.slug.endsWith("adiosbolita") ? 0 : 100 }}
        />
      );
    }
    return (
      <FontIcon name={item.oIcon.name} size={30} color={item.oIcon.color} />
    );
  };

  render() {
    const { onPress, isSelected, item } = this.props;
    const { animatedValue } = this.state;
    Animated.timing(animatedValue, {
      toValue: isSelected ? 100 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    const { scale } = this._scaleStyle();
    return (
      <TouchableOpacity activeOpacity={1} style={[styles.btn, {paddingVertical: Platform.OS == 'ios' ? 20 : null,
        paddingBottom: Platform.OS == 'ios' ? 15 : 3}]} onPress={onPress}>
        <View style={[styles.image, {borderColor: item.oTerm.slug.endsWith("adiosbolita") ? 'transparent' : '#FFDC00',shadowColor: item.oTerm.slug.endsWith("adiosbolita") ? 'transparent' : 'black',borderRadius: item.oTerm.slug.endsWith("adiosbolita") ? 0 : 100}]}>{this._renderImage()}</View>
       
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 8,
    paddingBottom: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 12,
    color: "#222",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#FFDC00',
    padding: 1,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
});

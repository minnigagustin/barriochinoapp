import React, { PureComponent } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
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
          containerStyle={{ borderRadius: 100 }}
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
      <TouchableOpacity activeOpacity={1} style={styles.btn} onPress={onPress}>
        <View style={styles.image}>{this._renderImage()}</View>
        <Animated.Text
          style={[
            styles.name,
            {
              transform: [{ scale }],
              color: isSelected ? colorPrimary : "#222",
            },
          ]}
        >
          {he.decode(item.oTerm.name)}
        </Animated.Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 12,
    color: "#222",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    padding: 5,
  },
});

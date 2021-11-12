import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

export default class MyAlert extends Component {
  static defaultProps = {
    text: "There was an error processing your request",
    type: "error",
    style: {},
  };

  _getBgColor = () => {
    const { type } = this.props;
    switch (type) {
      case "error":
        return "rgb(254, 215, 215)";
      case "success":
        return "rgb(198, 246, 213)";
      case "warning":
        return "rgb(254, 235, 200)";
      case "info":
        return "rgb(190, 227, 248)";
      default:
        return "";
    }
  };
  _renderIcon = () => {
    const { type } = this.props;
    switch (type) {
      case "error":
        return <MaterialIcons name="error" size={24} color="#e53e3e" />;
      case "success":
        return <AntDesign name="checkcircle" size={24} color="#38a169" />;
      case "warning":
        return <MaterialIcons name="error" size={24} color="#dd6b20" />;
      case "info":
        return <AntDesign name="infocirlce" size={24} color="#3182ce" />;
      default:
        return null;
    }
  };

  render() {
    const { text, style } = this.props;

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: this._getBgColor() },
          style,
        ]}
      >
        {this._renderIcon()}
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 4,
  },
  text: {
    marginLeft: 7,
  },
});

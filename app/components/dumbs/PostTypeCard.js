import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import he from "he";
import { FontIcon } from "../../wiloke-elements";

export default class PostTypeCard extends PureComponent {
  static propTypes = {
    iconName: PropTypes.string,
    backgroundColor: PropTypes.string,
    backgroundImage: PropTypes.string,
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    image: PropTypes.string,
  };

  static defaultProps = {
    iconName: "",
    backgroundColor: "",
    image: "",
    backgroundImage: "",
    onPress: () => {},
  };

  render() {
    const {
      iconName,
      backgroundColor,
      label,
      onPress,
      backgroundImage,
    } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.container, { backgroundColor }]}
        onPress={onPress}
      >
        <View style={styles.iconWrapper}>
          {!!iconName && <FontIcon name={iconName} size={30} color="#fff" />}
        </View>
        <View style={styles.labelWrapper}>
          <Text style={styles.label}>{he.decode(label)}</Text>
        </View>
        {!!backgroundImage && (
          <ImageBackground
            source={{ uri: backgroundImage }}
            style={styles.backgroundImage}
          />
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 9,
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    overflow: "hidden",
    borderRadius: 3,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
  },
  containerBackground: {
    resizeMode: "cover",
  },
  iconWrapper: {
    height: 33,
  },
  labelWrapper: {
    marginTop: 10,
  },
  label: {
    color: "#fff",
    fontWeight: "500",
  },
});

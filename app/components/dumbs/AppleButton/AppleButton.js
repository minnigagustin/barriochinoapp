import React, { PureComponent } from "react";
import { Text, View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import PropTypes from "prop-types";
import * as AppleAuthentication from "expo-apple-authentication";
import { Button } from "../../../wiloke-elements";
import { FontAwesome5 } from "@expo/vector-icons";
import { colorLight, screenWidth } from "../../../constants/styleConstants";
import { TouchableOpacity } from "react-native-gesture-handler";
import configureApp from "../../../../configureApp.json";
import { AppleAuthenticationButtonStyle } from "expo-apple-authentication";

export default class AppleButton extends PureComponent {
  static propTypes = {
    containerStyle: PropTypes.object,
    onAction: PropTypes.func,
    onError: PropTypes.func,
    buttonStyle: PropTypes.oneOfType(["black", "white"]),
  };
  static defaultProps = {
    buttonStyle: "black",
  };

  _handleLoginApple = async () => {
    const { onAction, onError } = this.props;
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      onAction && onAction(credential);
      // signed in
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        onError(e.code);
      }
    }
  };

  _renderAppleIcon = () => {
    return (
      <FontAwesome5
        name="apple"
        size={26}
        color="#fff"
        style={{ marginRight: 10 }}
      />
    );
  };

  render() {
    const { containerStyle, isLoading, buttonStyle } = this.props;
    return (
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: "#222",
            borderRadius: 10,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                buttonStyle === "black"
                  ? AppleAuthenticationButtonStyle.BLACK
                  : AppleAuthenticationButtonStyle.WHITE
              }
              style={[containerStyle, { width: "100%", height: 45 }]}
              onPress={this._handleLoginApple}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  colorLight: {
    color: colorLight,
  },
});

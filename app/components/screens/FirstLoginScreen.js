import React, { PureComponent } from "react";
import { View, Dimensions, Alert, Button, Text } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { connect } from "react-redux";
import configureApp from "../../../configureApp.json";
import appJson from "../../../app.json";
import {
  FormFirstLogin,
  WilWebView,
  LostPasswordModal,
  FBButton,
} from "../dumbs";
import {
  login,
  loginFb,
  getAccountNav,
  getShortProfile,
  getMyProfile,
  setUserConnection,
  getMessageChatNewCount,
  setDeviceTokenToFirebase,
  getNotificationAdminSettings,
  setNotificationSettings,
  loginApple,
  getProductsCart,
  loginWithOTP,
  requireOTPCode,
  loginWithGoogle,
} from "../../actions";
import { FontIcon, LoadingFull } from "../../wiloke-elements";
import AppleButton from "../dumbs/AppleButton/AppleButton";
import { majorVersionIOS } from "../smarts/LoginFormContainer";
import { ScrollView } from "react-native-gesture-handler";
import { screenHeight } from "../../constants/styleConstants";
import OtpInputs from "../../wiloke-elements/components/atoms/OTPInput";
import ModalQRCode from "../dumbs/ModalQRCode/ModalQRCode";
import deeplinkListener from "../../utils/deeplinkListener";
import GoogleButton from "../dumbs/GoogleButton/GoogleButton";
import { translations } from "../../reducers/translations";

const {
  title: firstLoginTitle,
  text: firstLoginText,
  skipButtonText,
} = configureApp.loginScreenStartApp;

class FirstLoginScreen extends PureComponent {
  state = {
    isLoginLoading: false,
    isLoadingFull: false,
    fbLoginErrorMessage: "",
    modalVisible: false,
    loadingApple: false,
    otpCode: "",
    isLoginByOTPCode: false,
    isOTPVisible: false,
    loadingButton: false,
  };

  componentDidMount() {
    const { navigation, auth, listings } = this.props;
    if (!auth.isLoggedIn) {
      deeplinkListener(navigation, listings);
    }
  }

  _handleSubmitCode = async () => {
    await this.setState({
      loadingButton: true,
    });
    const { otpCode, isLoginByOTPCode } = this.state;
    const { loginWithOTP } = this.props;
    await loginWithOTP(otpCode, isLoginByOTPCode);
    isLoginByOTPCode &&
      this.setState({
        isLoginByOTPCode: false,
      });
    this._getInfo();
  };

  _handleLoginDefault = async (results) => {
    const { login } = this.props;
    this.setState({
      isLoginLoading: true,
      isLoadingFull: true,
    });
    await login(results);
    const { auth } = this.props;
    if (auth.nextOTP) {
      this.setState({
        isOTPVisible: true,
        isLoginLoading: false,
        isLoadingFull: false,
      });
      return;
    }
    this._getInfo();
  };

  _handleLoginFb = async (data, token) => {
    const { loginFb, translations } = this.props;

    await this.setState({ isLoadingFull: true });
    await loginFb(data.id, token);
    const { auth } = this.props;
    if (auth.nextOTP) {
      this.setState({
        isOTPVisible: true,
        isLoadingFull: false,
      });
      return;
    }

    if (!auth.token) {
      await this.setState({
        isLoadingFull: false,
      });
      Alert.alert("Facebook Login Error!", translations.fbEmailError);
      return;
    }
    this._getInfo();
  };

  _handleLoginFbError = (errorType) => {
    const { translations } = this.props;
    console.log(333);
    this.setState({
      fbLoginErrorMessage: translations[errorType],
    });
  };

  _handleClickGetOtp = async (username) => {
    const { requireOTPCode } = this.props;
    this.setState({ isLoadingFull: true, isLoginByOTPCode: true });
    await requireOTPCode(username);
    const { auth } = this.props;
    if (auth.nextOTP) {
      this.setState({
        isOTPVisible: true,
        isLoadingFull: false,
      });
      return;
    }
    if (!auth.token) {
      auth.message && Alert.alert("Something went wrong!", auth.message);
      this.setState({
        isLoadingFull: false,
        isLoginByOTPCode: false,
      });
      return;
    }
    this.setState({
      isLoginByOTPCode: false,
    });
    this._getInfo();
  };

  _handleLoginApple = async (credential) => {
    const { loginApple } = this.props;
    const { authorizationCode, email, identityToken } = credential;
    await this.setState({
      isLoadingFull: true,
    });
    await loginApple(authorizationCode, identityToken, email);
    const { auth } = this.props;
    if (auth.nextOTP) {
      this.setState({
        isOTPVisible: true,
        isLoadingFull: false,
      });
      return;
    }
    if (!auth.token) {
      Alert.alert(auth.message);
      this.setState({
        isLoadingFull: false,
      });
      return;
    }
    this._getInfo();
  };

  _handleLoginWithGoogle = async (accessToken, user) => {
    const { loginWithGoogle } = this.props;
    await this.setState({
      isLoadingFull: true,
    });
    await loginWithGoogle(accessToken, user);
    const { auth } = this.props;
    if (!auth.token) {
      return this.setState({
        isLoadingFull: false,
      });
    }
    this._getInfo();
  };

  _getInfo = async () => {
    const {
      getAccountNav,
      getMyProfile,
      getShortProfile,
      setUserConnection,
      getMessageChatNewCount,
      deviceToken,
      setDeviceTokenToFirebase,
      navigation,
      getProductsCart,
    } = this.props;
    getAccountNav();
    getMyProfile();
    await getShortProfile();
    const { shortProfile, auth } = this.props;
    const myID = shortProfile.userID;
    const { firebaseID } = shortProfile;
    if (auth.isLoggedIn && myID) {
      setUserConnection(myID, true);
      getMessageChatNewCount(myID);
      setDeviceTokenToFirebase(myID, firebaseID, deviceToken);
      getProductsCart(auth.token);
      await this._handleNotificationSettings(myID);
      navigation.navigate("HomeScreen");
    }
    this.setState({
      isLoginLoading: false,
      isLoadingFull: false,
      isOTPVisible: false,
      loadingButton: false,
    });
    Keyboard.dismiss();
  };

  _handleNotificationSettings = async (myID) => {
    await this.props.getNotificationAdminSettings();
    const { notificationAdminSettings } = this.props;
    //=== EdenTuan xoa await di --- await
    this.props.setNotificationSettings(
      myID,
      notificationAdminSettings,
      "start"
    );
  };

  _handleSkip = () => {
    const { navigation } = this.props;
    navigation.navigate("HomeScreen");
  };

  _handleNavigateRegister = () => {
    const { navigation } = this.props;
    navigation.navigate("AccountScreen", {
      activeType: "register",
    });
  };

  _handleNavigateLostPassword = () => {
    const url = "https://wilcity.com/login/?action=rp";
    this.setState({
      modalVisible: true,
    });
  };

  _handleGoBack = () => {
    this.setState({
      modalVisible: false,
    });
  };

  _renderBottom = () => {
    const { settings, translations } = this.props;
    const iOsSettings = appJson.expo.ios;
    const androidSettings = appJson.expo.android;
    const { isLoadingFull, loadingApple } = this.state;
    const { oFacebook } = settings;
    return (
      <View style={{ width: "100%" }}>
        <View style={{ marginBottom: 10 }}>
          {/* configureApp.googleLogin.usesGoogleSignIn && (
            <GoogleButton
              radius="round"
              isLoading={false}
              onAction={this._handleLoginWithGoogle}
              textButton={translations.loginWithGoogle}
              style={{ borderRadius: 6, height: 50, paddingTop: 15 }}
            />
          ) */}
        </View>
        {/* !oFacebook && oFacebook.isEnableFacebookLogin && (
          <FBButton
            radius="round"
            isLoading={false}
            appID={oFacebook.appID}
            onAction={this._handleLoginFb}
            onError={this._handleLoginFbError}
            style={{ borderRadius: 6, height: 50 }}
          />
        ) */}

        {/* Platform.OS === "ios" &&
          majorVersionIOS > 12 &&
          iOsSettings.usesAppleSignIn && (
            <View style={{ marginTop: 10 }}>
              <AppleButton
                onAction={this._handleLoginApple}
                isLoading={false}
                buttonStyle={configureApp.appleColor}
              />
            </View>
          ) */}
      </View>
    );
  };

  _renderModalOTP = () => {
    const { isOTPVisible, loadingButton } = this.state;
    const { translations, settings, loginError } = this.props;
    return (
      <ModalQRCode
        isVisible={isOTPVisible}
        headerIcon="key"
        headerTitle={translations["enterInOTPCode"]}
        colorPrimary={settings.colorPrimary}
        cancelText={translations.cancel}
        submitText={translations.enterCode}
        onBackdropPress={() =>
          this.setState({
            isOTPVisible: false,
            isLoginByOTPCode: false,
          })
        }
        onSubmitAsync={this._handleSubmitCode}
        loadingButton={loadingButton}
      >
        <View>
          <OtpInputs
            onChangeCode={(code) => this.setState({ otpCode: code })}
          />
          {this.props.auth.status === "error" && (
            <View style={{ marginTop: -8 }}>
              <P style={{ color: Consts.colorQuaternary, fontSize: 12 }}>
                {translations[this.props.auth.msg]}
              </P>
            </View>
          )}
        </View>
      </ModalQRCode>
    );
  };

  render() {
    const { translations, settings, loginError } = this.props;
    const {
      isLoginLoading,
      fbLoginErrorMessage,
      modalVisible,
      isOTPVisible,
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <FormFirstLogin
          title={firstLoginTitle}
          settings={settings}
          text={firstLoginText}
          skipButtonText={skipButtonText}
          colorPrimary={settings.colorPrimary}
          translations={translations}
          onSkip={this._handleSkip}
          onNavigateRegister={this._handleNavigateRegister}
          onNavigateLostPassword={this._handleNavigateLostPassword}
          isLoginLoading={isLoginLoading}
          onLogin={this._handleLoginDefault}
          loginError={
            loginError
              ? translations[loginError]
                ? translations[loginError]
                : loginError
              : ""
          }
          loginFbError={fbLoginErrorMessage}
          renderBottom={this._renderBottom}
          onClickGetOtp={this._handleClickGetOtp}
        />
        <LostPasswordModal
          visible={modalVisible}
          onRequestClose={this._handleGoBack}
          source={{ uri: settings.resetPasswordURL }}
        />
        <LoadingFull visible={this.state.isLoadingFull} />
        {this._renderModalOTP()}
      </View>
    );
  }
}

const mapStateToProps = ({
  translations,
  deviceToken,
  shortProfile,
  auth,
  settings,
  notificationAdminSettings,
  loginError,
  listings,
}) => ({
  translations,
  deviceToken,
  shortProfile,
  auth,
  settings,
  notificationAdminSettings,
  loginError,
  listings,
});

const mapDispatchToProps = {
  login,
  loginFb,
  getAccountNav,
  getShortProfile,
  getMyProfile,
  setUserConnection,
  getMessageChatNewCount,
  setDeviceTokenToFirebase,
  getNotificationAdminSettings,
  setNotificationSettings,
  loginApple,
  getProductsCart,
  loginWithOTP,
  requireOTPCode,
  loginWithGoogle,
};

export default connect(mapStateToProps, mapDispatchToProps)(FirstLoginScreen);

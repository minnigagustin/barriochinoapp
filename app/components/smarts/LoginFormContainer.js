import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Keyboard,
  Dimensions,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";
import {
  Button,
  P,
  ViewWithLoading,
  Modal,
  FontIcon,
  LoadingFull,
} from "../../wiloke-elements";
import { connect } from "react-redux";
import {
  login,
  loginFb,
  getAccountNav,
  getMyProfile,
  register,
  getSignUpForm,
  getShortProfile,
  setUserConnection,
  getMessageChatNewCount,
  setDeviceTokenToFirebase,
  getNotificationAdminSettings,
  setNotificationSettings,
  loginApple,
  loginWithOTP,
  requireOTPCode,
  loginWithGoogle,
} from "../../actions";
import * as Consts from "../../constants/styleConstants";
import { Form, FBButton, LostPasswordModal } from "../dumbs";
import _ from "lodash";
import AppleButton from "../dumbs/AppleButton/AppleButton";
import OtpInputs from "../../wiloke-elements/components/atoms/OTPInput";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
import appJson from "../../../app.json";
import configureApp from "../../../configureApp.json";
import GoogleButton from "../dumbs/GoogleButton/GoogleButton";
import MyAlert from "../dumbs/MyAlert/MyAlert";
export const majorVersionIOS = parseInt(Platform.Version, 10);

class LoginFormContainer extends Component {
  static propTypes = {
    // onPressRegister: PropTypes.func
    onLogin: PropTypes.func,
  };
  static defaultProps = {
    // onPressRegister: () => {}
  };
  state = {
    formTypeFocus: "login",
    animation: new Animated.Value(0),
    isLoading: true,
    isLoadingFbLogin: false,
    fbLoginErrorMessage: "",
    isModalVisible: false,
    isLoadingApple: false,
    isOTPVisible: false,
    isShowLoadingFull: false,
    isLoginByOTPCode: false,
    otpCode: "",
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const activeType = navigation.state.params
      ? navigation.state.params.activeType
      : "login";
    await this.setState({
      formTypeFocus: activeType,
      animation: new Animated.Value(
        activeType === "register"
          ? 10 - (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH)
          : 0
      ),
    });
    await this.props.getSignUpForm();
    this.setState({
      isLoading: false,
    });
  }

  _handleNotificationSettings = async (myID) => {
    await this.props.getNotificationAdminSettings();
    const { notificationAdminSettings } = this.props;
    // === Eden Tuan delete await OK === //
    this.props.setNotificationSettings(
      myID,
      notificationAdminSettings,
      "start"
    );
  };

  _handleSubmitCode = async () => {
    const { otpCode, isLoginByOTPCode } = this.state;
    const { loginWithOTP, onLogin } = this.props;
    await loginWithOTP(otpCode, isLoginByOTPCode);
    this.setState({
      isOTPVisible: false,
      isLoginByOTPCode: false,
    });
    this._getInfo();
    onLogin && onLogin();
  };

  _handleOpenOTP = () => {
    const { auth } = this.props;
    if (auth.nextOTP) {
      this.setState({
        isOTPVisible: true,
      });
    }
    return;
  };

  _handleLoginDefault = (results, status) => async (_) => {
    const { login, onLogin } = this.props;
    this.setState({ isShowLoadingFull: true });
    await login(results);
    const { auth } = this.props;
    this._handleOpenOTP();
    this._getInfo();
    onLogin && onLogin();
  };

  _handleLoginFb = async (data, token) => {
    const { loginFb, onLogin, translations } = this.props;
    this.setState({ isLoadingFbLogin: true });
    await loginFb(data.id, token);
    const { auth } = this.props;
    if (auth.nextOTP) {
      this._handleOpenOTP();
      return;
    }
    if (!auth.token) {
      Alert.alert("Facebook Login error!", translations.fbEmailError);
    }
    this._getInfo();
    onLogin && onLogin();
  };

  _handleLoginFbError = (errorType) => {
    const { translations } = this.props;
    this.setState({
      fbLoginErrorMessage: translations[errorType],
    });
  };

  _handleLoginApple = async (credential) => {
    const { loginApple } = this.props;
    const { authorizationCode, email, identityToken } = credential;
    await this.setState({ isLoadingApple: true });
    await loginApple(authorizationCode, identityToken, email);
    const { auth } = this.props;
    if (auth.nextOTP) {
      this._handleOpenOTP();
      return;
    }
    if (!auth.token) {
      auth.message && Alert.alert(auth.message);
      this.setState({
        isLoadingApple: false,
      });
      return;
    }

    this._getInfo();
    onLogin && onLogin();
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
      await this._handleNotificationSettings(myID);
    }
    this.setState({
      isLoadingFbLogin: false,
      isLoadingApple: false,
      isShowLoadingFull: false,
    });
    Keyboard.dismiss();
  };

  _handleRegister = async (results, status) => {
    const {
      register,
      getAccountNav,
      getMyProfile,
      setUserConnection,
      getShortProfile,
      getMessageChatNewCount,
      deviceToken,
      setDeviceTokenToFirebase,
    } = this.props;
    status === "success" && (await register(results));
    getAccountNav();
    getMyProfile();
    await getShortProfile();
    const { shortProfile, auth } = this.props;
    const myID = shortProfile.userID;
    const { firebaseID } = shortProfile;
    if (auth.isLoggedIn) {
      setUserConnection(myID, true);
      getMessageChatNewCount(myID);
      setDeviceTokenToFirebase(myID, firebaseID, deviceToken);
      await this._handleNotificationSettings(myID);
    }
    Keyboard.dismiss();
  };

  _handleTab = (type) => async () => {
    Animated.timing(this.state.animation, {
      toValue:
        type === "login" ? 10 - (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        formTypeFocus: type,
      });
    });
  };

  _handleLostPassword = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  _handleCloseLostPasswordModal = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  _handleClickGetOtp = async (username) => {
    const { requireOTPCode } = this.props;
    this.setState({ isShowLoadingFull: true, isLoginByOTPCode: true });
    await requireOTPCode(username);
    const { auth } = this.props;
    if (auth.nextOTP) {
      this.setState({
        isOTPVisible: true,
        isShowLoadingFull: false,
      });
      return;
    }
    if (!auth.token) {
      auth.message && Alert.alert("Something went wrong!", auth.message);
      this.setState({
        isShowLoadingFull: false,
        isLoginByOTPCode: false,
      });
      return;
    }
    this.setState({
      isLoginByOTPCode: false,
    });
    this._getInfo();
  };

  _handleLoginWithGoogle = async (accessToken, user) => {
    const { loginWithGoogle } = this.props;
    await this.setState({
      isShowLoadingFull: true,
    });
    await loginWithGoogle(accessToken, user);
    const { auth } = this.props;
    if (!auth.token) {
      return this.setState({
        isShowLoadingFull: false,
      });
    }
    this._getInfo();
  };

  _renderGetOtpText = (result) => {
    const { translations } = this.props;
    return (
      <TouchableOpacity
        style={styles.textGetOTP}
        onPress={() => {
          if (!result.username) {
            return Alert.alert("Oops!", translations["pleseInputUserName"]);
          }
          this._handleClickGetOtp(result.username);
        }}
      >
        <FontIcon name="mail" size={14} color="#333" />
        <View style={{ marginLeft: 6 }}>
          <P style={styles.lostPasswordText}>{translations.getOtp}</P>
        </View>
      </TouchableOpacity>
    );
  };

  _renderFormLogin = () => {
    const { settings, loginError, translations } = this.props;
    const { oFacebook } = settings;
    const { fbLoginErrorMessage } = this.state;
    return (
      <View style={{ width: (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) - 20 }}>
        {(!!loginError || !!fbLoginErrorMessage) && (
          <View style={{ backgroundColor: "white", padding: 10 }}>
            <MyAlert
              text={
                fbLoginErrorMessage || translations[loginError] || loginError
              }
            />
          </View>
        )}
        <Form
          headerTitle={translations.login}
          headerIcon="lock"
          colorPrimary={settings.colorPrimary}
          validationData={translations.validationData}
          renderTopComponent={() => {
            return null;
          }}
          data={[
            {
              type: "text",
              name: "username",
              label: translations.username,
              required: true,
              validationType: "username",
            },
            {
              type: "password",
              name: "password",
              label: translations.password,
            },
          ]}
          renderButtonSubmit={this._renderFooterOfFormLogin}
        />

      </View>
    );
  };

  _renderFooterOfFormLogin = (results, status) => {
    const { isLoginLoading, settings, translations } = this.props;
    const { isLoadingFbLogin, isLoadingApple } = this.state;
    const iOsSettings = appJson.expo.ios;
    const androidSettings = appJson.expo.android;

    const { oFacebook } = settings;

    return (
      <View>
        {this._renderGetOtpText(results)}
        <Button
          backgroundColor="primary"
          colorPrimary={settings.colorPrimary}
          size="lg"
          radius="round"
          block={true}
          isLoading={isLoginLoading}
          onPress={this._handleLoginDefault(results, status)}
        >
          {translations.login}
        </Button>
        {settings.isAllowRegistering === "yes" && (
          <View
            style={{
              alignItems: "center",
              borderTopWidth: 1,
              borderTopColor: Consts.colorGray1,
              marginTop: 15,
              paddingTop: 15,
            }}
          >
            <Button
              backgroundColor="primary"
                    colorPrimary="#ffdc00"
              size="lg"
          radius="round"
          textStyle={{color: '#000000'}}
          block={true}
              onPress={this._handleTab("login")}
            >
              {translations.register}
            </Button>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={this._handleLostPassword}
          style={{ alignItems: "center", marginTop: 15 }}
        >
          <P>{translations.lostPassword}</P>
        </TouchableOpacity>
        {/* configureApp.googleLogin.usesGoogleSignIn && (
          <View style={{ marginTop: 10 }}>
            <GoogleButton
              radius="round"
              isLoading={false}
              onAction={this._handleLoginWithGoogle}
              textButton="Ingrese con Google"
              containerStyle={{
                borderWidth: 1,
                borderColor: "#4285F4",
                borderRadius: 3,
              }}
            />
          </View>
        )}
        {oFacebook.isEnableFacebookLogin && (
          <View style={{ marginTop: 10 }}>
            <FBButton
              radius="round"
              isLoading={isLoadingFbLogin}
              appID={oFacebook.appID}
              onAction={this._handleLoginFb}
              onError={this._handleLoginFbError}
            />
          </View>
        )}
        {Platform.OS === "ios" &&
          majorVersionIOS > 12 &&
          iOsSettings.usesAppleSignIn && (
            <View style={{ marginTop: 10 }}>
              <AppleButton
                onAction={this._handleLoginApple}
                isLoading={isLoadingApple}
                buttonStyle="black"
              />
            </View>
          ) */}
      </View>
    );
  };

  _renderFormRegister() {
    const { settings, translations, signUpForm, signupError } = this.props;
    const _signUpForm =
      !_.isEqual(signUpForm) &&
      signUpForm.map((item) => ({
        type: item.type,
        label: !!translations[item.label]
          ? translations[item.label]
          : item.label,
        name: item.key,
        ...(item.required ? { required: item.required } : {}),
        ...(!!item.validationType
          ? { validationType: item.validationType }
          : {}),
        ...(item.link ? { link: item.link } : {}),
      }));
    return (
      <View
        style={{
          position: "relative",
          left: 10,
          width: (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) - 20,
        }}
      >
        <ViewWithLoading
          isLoading={this.state.isLoading}
          contentLoader="contentHeader"
        >
          <Form
            headerTitle={translations.register}
            headerIcon="check-square"
            colorPrimary={settings.colorPrimary}
            validationData={translations.validationData}
            renderTopComponent={() => {
              return (
                signupError && (
                  <P style={{ color: Consts.colorQuaternary }}>
                    {translations[signupError]}
                  </P>
                )
              );
            }}
            data={_signUpForm}
            renderButtonSubmit={(results, status) => {
              const { translations, isSignupLoading, settings } = this.props;
              return (
                <View>
                  <Button
                    backgroundColor="primary"
                    colorPrimary={settings.colorPrimary}
                    size="lg"
                    radius="round"
                    block={true}
                    isLoading={isSignupLoading}
                    onPress={async () => this._handleRegister(results, status)}
                  >
                    {translations.register}
                  </Button>

                  <View
                    style={{
                      alignItems: "center",
                      borderTopWidth: 1,
                      borderTopColor: Consts.colorGray1,
                      marginTop: 15,
                      paddingTop: 15,
                    }}
                  >
                    <Button
                      backgroundColor="primary"
                      colorPrimary="#000000"
                      size="lg"
                      radius="round"
                      block={true}
                      onPress={this._handleTab("register")}
                    >
                      {translations.login}
                    </Button>
                  </View>
                </View>
              );
            }}
          />
        </ViewWithLoading>
      </View>
    );
  }

  render() {
    const { settings, translations } = this.props;
    const { isModalVisible, isOTPVisible } = this.state;
    return (
      <View
        style={{
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            flexDirection: "row",
            width: (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) * 2,
            transform: [
              {
                translateX: this.state.animation,
              },
            ],
          }}
        >
          {this._renderFormLogin()}
          {settings.isAllowRegistering === "yes" && this._renderFormRegister()}
        </Animated.View>
        <LostPasswordModal
          visible={isModalVisible}
          onRequestClose={this._handleCloseLostPasswordModal}
          source={{ uri: settings.resetPasswordURL }}
        />
        <LoadingFull visible={this.state.isShowLoadingFull} />
        <Modal
          isVisible={isOTPVisible}
          headerIcon="key"
          headerTitle={translations["enterInOTPCode"]}
          colorPrimary={settings.colorPrimary}
          cancelText={translations.cancel}
          submitText={translations.enterCode}
          onBackdropPress={() =>
            this.setState({ isOTPVisible: false, isLoginByOTPCode: false })
          }
          onSubmitAsync={this._handleSubmitCode}
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
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textGetOTP: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
  lostPasswordText: {
    color: "#333",
    fontSize: 12,
    marginBottom: 0,
  },
});

const mapStateToProps = (state) => ({
  settings: state.settings,
  auth: state.auth,
  loginError: state.loginError,
  isLoginLoading: state.isLoginLoading,
  translations: state.translations,
  signUpForm: state.signUpForm,
  signupError: state.signupError,
  isSignupLoading: state.isSignupLoading,
  shortProfile: state.shortProfile,
  deviceToken: state.deviceToken,
  notificationAdminSettings: state.notificationAdminSettings,
});
const mapDispatchToProps = {
  requireOTPCode,
  login,
  loginFb,
  getAccountNav,
  getMyProfile,
  register,
  getSignUpForm,
  getShortProfile,
  setUserConnection,
  getMessageChatNewCount,
  setDeviceTokenToFirebase,
  getNotificationAdminSettings,
  setNotificationSettings,
  loginApple,
  loginWithOTP,
  loginWithGoogle,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginFormContainer);

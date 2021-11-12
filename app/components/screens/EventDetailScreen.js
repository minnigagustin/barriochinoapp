import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import _ from "lodash";
import * as Consts from "../../constants/styleConstants";
import { ParallaxScreen, ActionSheet, RTL, Button } from "../../wiloke-elements";
import { Feather } from "@expo/vector-icons";
import { EventDetailContainer, EventDiscussionContainer } from "../smarts";
import { Heading } from "../dumbs";
import { connect } from "react-redux";
import { addMyFavorites } from "../../actions";
class EventDetailScreen extends Component {
  state = {
    isToggleDiscussion: false,
    isLoadingFavorite: false,
  };

  _handleAccountScreen = () => {
    const { translations, navigation } = this.props;
    Alert.alert(translations.login, "Tu necesitas Iniciar Sesion primero", [
      {
        text: translations.cancel,
        style: "cancel",
      },
      {
        text: translations.continue,
        onPress: () => navigation.navigate("AccountScreen"),
      },
    ]);
  };

  _handleAddFavorite = async () => {
    const { navigation, addMyFavorites } = this.props;
    const { params } = navigation.state;
    await this.setState({
      isLoadingFavorite: true,
    });
    await addMyFavorites(params.id);
    this.setState({
      isLoadingFavorite: false,
    });
  };

  _handleDiscussion = async (buttonIndex) => {
    if (buttonIndex === 1) {
      await this.setState({
        isToggleDiscussion: true,
      });
      this.setState({
        isToggleDiscussion: false,
      });
    }
  };

  renderHeaderLeft = () => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
        <View style={styles.back}>
          <Feather
            name={RTL() ? "chevron-right" : "chevron-left"}
            size={26}
            color="#fff"
          />
        </View>
      </TouchableOpacity>
    );
  };

  renderHeaderCenter = () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    return (
      <Text style={{ color: "#fff" }} numberOfLines={1}>
        {params.name}
      </Text>
    );
  };

  
  _renderFavorite = () => {
    const { isLoadingFavorite } = this.state;
    const {
      navigation,
      eventDetail,
      listIdPostFavorites,
      listIdPostFavoritesRemoved,
      auth,
    } = this.props;
    const { params } = navigation.state;
    const listIdPostFavoritesFilter = listIdPostFavorites.filter(
      (item) => item.id === params.id
    );
    const isListingFavorite =
      !_.isEmpty(eventDetail) &&
      !!eventDetail.oFavorite.isMyFavorite &&
      eventDetail.oFavorite.isMyFavorite !== "no";
    const condition =
      listIdPostFavoritesFilter.length > 0 ||
      (listIdPostFavoritesFilter.length > 0 &&
        !_.isEmpty(eventDetail) &&
        isListingFavorite) ||
      (listIdPostFavoritesRemoved.length === 0 && isListingFavorite);
    return isLoadingFavorite ? (
      <View style={{ marginTop: 10 }}>
        <ActivityIndicator size="small" color={Consts.colorDark3} />
      </View>
    ) : (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={
          auth.isLoggedIn ? this._handleAddFavorite : this._handleAccountScreen
        }
      >
        <Feather
          name="heart"
          size={22}
          color={
            condition && auth.isLoggedIn
              ? Consts.colorQuaternary
              : Consts.colorDark3
          }
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { navigation, settings, auth, eventDetail, translations } = this.props;
    const { params } = navigation.state;
    const { isToggleDiscussion } = this.state;
    const {isSubmittable, isEditable, postLink} = eventDetail;
    console.log(`${postLink}?mode=preview&iswebview=yes&hide_body=listing_details&token=${auth.token}`)

    return (
      <View style={{ flex: 1, position: "relative" }}>
        <ParallaxScreen
          headerImageSource={params.image}
          overlayRange={[0, 0.9]}
          overlayColor={settings.colorPrimary}
          renderHeaderLeft={this.renderHeaderLeft}
          renderHeaderCenter={this.renderHeaderCenter}
          renderHeaderRight={this.renderHeaderRight}
          renderContent={() => (
            <View style={{ padding: 10 }}>
              <View style={styles.heading}>
                <Heading
                  title={params.name}
                  titleSize={18}
                  textSize={12}
                  style={{
                    maxWidth: "85%",
                  }}
                />
                {this._renderFavorite()}
              </View>
              <View style={styles.meta}>
              
                <Text style={styles.textSmall}>{params.interested}</Text>
              </View>
              <View style={styles.space} />
              <View style={styles.wrap}>
                <EventDetailContainer navigation={navigation} />

                {eventDetail.isEnableDiscussion === "yes" && (
                  <View style={{ maxWidth: Consts.screenWidth }}>
                    <EventDiscussionContainer
                      id={params.id}
                      type="no-latest"
                      navigation={navigation}
                      isToggleDiscussion={false}
                    />
                  </View>
                )}
              </View>
            </View>
          )}
        />
        <View style={{ position: "absolute", bottom: 80, left: 10, zIndex: 999 }}>
          {isEditable && (
            <Button
              backgroundColor="secondary"
              color="light"
              size="sm"
              radius="round"
              onPress={() => {
                navigation.navigate("PageScreen2", {
                  uri: `${postLink}?mode=preview&iswebview=yes&hide_body=listing_details&token=${auth.token}`,
                  isEditListing: true,
                });
              }}
            >
              {translations.edit} {translations.listing}
            </Button>
          )}
          {isSubmittable && (
            <>
              <View style={{ height: 6 }} />
              <Button
                backgroundColor="primary"
                color="light"
                colorPrimary={settings.colorPrimary}
                size="sm"
                radius="round"
                onPress={() => {
                  navigation.navigate("PageScreen2", {
                    uri: `${postLink}?mode=preview&iswebview=yes&hide_body=listing_details&token=${auth.token}`,
                    isSubmitListing: true,
                  });
                }}
              >
                {translations.submit} {translations.listing}
              </Button>
            </>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textSmall: {
    fontSize: 11,
    color: Consts.colorDark3,
  },
  more: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  back: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  wrap: {
    marginHorizontal: -10,
    paddingHorizontal: 10,
    backgroundColor: Consts.colorGray2,
    alignItems: "center",
  },
  meta: {
    flexDirection: "row",
    marginTop: 10,
  },
  space: {
    height: 10,
  },
});

const mapStateToProps = ({
  settings,
  translations,
  auth,
  eventDetail,
  listIdPostFavorites,
  listIdPostFavoritesRemoved,
}) => ({
  settings,
  translations,
  auth,
  eventDetail,
  listIdPostFavorites,
  listIdPostFavoritesRemoved,
});

const mapDispatchToProps = {
  addMyFavorites,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetailScreen);

import React, { PureComponent } from "react";
import { Text, View, Alert, Platform } from "react-native";
import { connect } from "react-redux";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";
import {
  getListingSearchResults,
  getNearByFocus,
  getLocations,
} from "../../../actions";
import PropTypes from "prop-types";
import WilTab from "../../../wiloke-elements/components/molecules/WilTab";
import { ViewWithLoading, MessageError } from "../../../wiloke-elements";
import * as Consts from "../../../constants/styleConstants";
import ListingCarouselItem from "./ListingCarouselItem";
import ListCategoriesSelect from "../ListingCategoriesNow/ListCategoriesSelect";

class ListingTabs extends PureComponent {
  static propTypes = {
    tabs: PropTypes.array,
    categories: PropTypes.array,
    initialIndex: PropTypes.number,
  };

  state = {
    isLoading: true,
    focusedIndex: 0,
    selectedTab: {},
    selectedCat: {},
    location: null,
    isGetLocationLoading: false,
  };

  async componentDidMount() {
    const {
      tabs,
      categories,
      getListingSearchResults,
      initialIndex,
      postType,
    } = this.props;
    const params = {
      page: 1,
      postsPerPage: 4,
      order: "DESC",
      [categories[initialIndex].oTerm.taxonomy]:
        categories[initialIndex].oTerm.term_id,
      [tabs[initialIndex].key]: "yes",
      postType,
    };
    await getListingSearchResults(params, categories[initialIndex].restAPI);
    const { listingSearchResults } = this.props;
    this.setState({
      isLoading: false,
      focusedIndex: 0,
      selectedTab: tabs[initialIndex],
      selectedCat: categories[initialIndex],
    });
    const hasNearByMe =
      tabs.filter((item) => item.key === "nearbyme").length > 0;
    if (hasNearByMe) {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    try {
      this.setState({
        isGetLocationLoading: true,
      });
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
        });
        console.log(location);
        await this.props.getLocations(location);
        this.setState({
          isGetLocationLoading: false,
        });
        this.props.getNearByFocus();
      } else {
        throw new Error("Location permission not granted");
      }
    } catch (err) {
      const { translations } = await this.props;
      console.log(err);
      Platform === "android"
        ? IntentLauncher.startActivityAsync(
            IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
          )
        : Alert.alert(
            he.decode(translations.askForAllowAccessingLocationTitle),
            he.decode(translations.askForAllowAccessingLocationDesc),
            [
              {
                text: translations.cancel,
                style: "cancel",
              },
              {
                text: translations.ok,
                onPress: () => Linking.openURL("app-settings:"),
              },
            ],
            { cancelable: false }
          );
    }
  };

  _renderTabItem = (route, nextItem, index, indexFocused) => {
    const { isLoading } = this.state;
    const { listingSearchResults, settings, navigation } = this.props;
    if (isLoading) {
      return (
        <View style={{ paddingTop: 10 }}>
          <ViewWithLoading isLoading={true} contentLoader="content" />
        </View>
      );
    }
    if (listingSearchResults.status === "error") {
      return <MessageError msg={listingSearchResults.msg} />;
    }
    return (
      <ListingCarouselItem
        data={listingSearchResults.oResults}
        navigation={navigation}
        colorPrimary={settings.colorPrimary}
        admob={settings.oAdMob}
      />
    );
  };

  _handleSelectCat = async (catSelected) => {
    const { selectedTab } = this.state;
    const { getListingSearchResults, postType } = this.props;
    const params = {
      page: 1,
      postsPerPage: 4,
      order: "DESC",
      [selectedTab.key]: "yes",
      [catSelected.oTerm.taxonomy]: catSelected.oTerm.term_id,
      postType,
    };
    await this.setState({
      isLoading: true,
    });
    await getListingSearchResults(params);

    this.setState({
      isLoading: false,
      selectedCat: catSelected,
    });
  };

  _handlePress = async (route, nextItem, index) => {
    const { focusedIndex, selectedCat } = this.state;
    const {
      getListingSearchResults,
      locations,
      settings,
      nearByFocus,
      postType,
    } = this.props;
    const { coords } = locations.location;
    const nearby = {
      lat: coords.latitude,
      lng: coords.longitude,
      unit: settings.unit,
      radius: 5,
    };
    // if (route.isFocused) {
    //   return;
    // }
    if (index === focusedIndex) {
      return;
    }
    const params = {
      page: 1,
      postsPerPage: 4,
      order: "DESC",
      [route.key]: "yes",
      [selectedCat.oTerm.taxonomy]: selectedCat.oTerm.term_id,
      ...(route.key === "nearbyme" && nearByFocus ? nearby : {}),
      postType,
    };
    await this.setState({
      isLoading: true,
    });
    await getListingSearchResults(params);
    this.setState({
      isLoading: false,
      focusedIndex: index,
      selectedTab: route,
    });
  };

  render() {
    const { tabs, settings, initialIndex, categories, subcategories, navigation, subevents } = this.props;
    return (
      <View>
        <ListCategoriesSelect
          categories={categories}
          onSelect={this._handleSelectCat}
          subcategories={subcategories}
          subevents={subevents}
          navigation={navigation}
        />
     
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  settings: state.settings,
  listingSearchResults: state.listingSearchResults,
  locations: state.locations,
  nearByFocus: state.nearByFocus,
  translations: state.translations,
  settings: state.settings,
});

const mapDispatchToProps = {
  getListingSearchResults,
  getNearByFocus,
  getLocations,
};
export default connect(mapStateToProps, mapDispatchToProps)(ListingTabs);

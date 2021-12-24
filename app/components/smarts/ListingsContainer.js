import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  Button,
  Platform,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Animated,
  Easing,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import _ from "lodash";
import he from "he";
import { connect } from "react-redux";
import { getListings, getListingsLoadmore } from "../../actions";
import { ListingItem, MapSlider, IconMapMarker } from "../dumbs";
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col,
  bottomBarHeight,
  Loader,
  FontIcon,
  wait,
  getBusinessStatus,
} from "../../wiloke-elements";
import {
  colorSecondary,
  colorQuaternary,
  screenWidth,
  screenHeight,
  colorGray1,
} from "../../constants/styleConstants";
import { getDistance } from "../../utils/getDistance";

const RADIUS = 10;
const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0.02 : 1;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * getCoordinateFromListItem
 * @param {array} listItem đầu vào là array có chứa Coordinate sai cú pháp và thêm vào obj coordinate mới cho đúng
 */
const getCoordinateFromListItem = (listItem) => {
  return listItem.map((item) => ({
    ...item,
    coordinate: {
      latitude: Number(item.oAddress.lat),
      longitude: Number(item.oAddress.lng),
    },
  }));
};

class ListingsContainer extends Component {
  static defaultProps = {
    horizontal: false,
  };

  static propTypes = {
    horizontal: PropTypes.bool,
  };

  state = {
    refreshing: false,
    startLoadmore: false,
    postType: null,
    isMapVisible: false,
    aceptar: true,
    isMapVisibleAnimated: new Animated.Value(0),
    itemCurrentSlideID: null,
  };

  prevPage = 1;

  _getId = (postType) => {
    const { categoryList, locationList } = this.props;
    const getId = (arr) => arr.filter((item) => item.selected)[0].id;
    const categoryId =
      typeof categoryList[postType] !== "undefined" &&
      categoryList[postType].length > 0 &&
      getId(categoryList[postType]) !== "wilokeListingCategory"
        ? getId(categoryList[postType])
        : null;
    const locationId =
      typeof locationList[postType] !== "undefined" &&
      locationList[postType].length > 0 &&
      getId(locationList[postType]) !== "wilokeListingLocation"
        ? getId(locationList[postType])
        : null;
    return { categoryId, locationId };
  };

  _getListing = async () => {
    try {
      const {
        locations,
        getListings,
        navigation,
        nearByFocus,
        settings,
      } = this.props;
      const { coords } = locations.location;
      const nearBy = {
        lat: coords.latitude,
        lng: coords.longitude,
        unit: settings.unit,
        radius: RADIUS,
      };
      const { state } = navigation;
      const nextRoute = navigation.dangerouslyGetParent().state;
      const postType = state.params ? state.params.key : nextRoute.key;
      const { categoryId, locationId } = this._getId(postType);
      await this.setState({ postType });
      await getListings(
        categoryId,
        locationId,
        postType,
        nearByFocus ? nearBy : {}
      );
      await wait(1000);
      this.setState({ startLoadmore: true });
    } catch (err) {
      console.log(err);
    }
  };

  _getListingSuccess = (listings, postType) => {
    return (
      !_.isEmpty(listings[postType]) && listings[postType].status === "success"
    );
  };

  componentDidMount() {
    this._getListing();
    AsyncStorage.getItem('gps').then((value) => {
      if(value){
     this.setState({ aceptar: false });   
    }
      });
  }


  componentDidUpdate(prevProps, prevState) {
    const { navigation } = this.props;
    const { state } = this.props.navigation.dangerouslyGetParent();
    if (
      prevProps.nearByFocus !== this.props.nearByFocus ||
      !_.isEqual(
        prevProps.locationList["listing"],
        this.props.locationList["listing"]
      ) ||
      !_.isEqual(
        prevProps.categoryList["listing"],
        this.props.categoryList["listing"]
      )
    ) {
      console.log("update");
      this.prevPage = 1;
    }
  }

  _handleRefresh = async () => {
    try {
      this.setState({ refreshing: true });
      await this._getListing();
      this.setState({ refreshing: false });
    } catch (err) {
      console.log(err);
    }
  };

  _handleEndReached = (next, totalPage) => async () => {
    const {
      locations,
      getListingsLoadmore,
      nearByFocus,
      settings,
    } = this.props;
    const { coords } = locations.location;
    const nearby = {
      lat: coords.latitude,
      lng: coords.longitude,
      unit: settings.unit,
      radius: RADIUS,
    };
    const { postType } = this.state;
    const { startLoadmore } = this.state;
    const { categoryId, locationId } = this._getId(postType);
    if (startLoadmore && next !== false && this.prevPage <= totalPage) {
      this.prevPage++;
      await getListingsLoadmore(
        this.prevPage,
        categoryId,
        locationId,
        postType,
        nearByFocus ? nearby : {}
      );
    }
  };

  renderItem = (style, isFooterAutoDisable = true) => ({ item }) => {
    const {
      navigation,
      settings,
      locations,
      translations,
      nearByFocus,
    } = this.props;
    const { unit } = settings;
    const { latitude, longitude } = locations.location.coords;
    const address = item.oAddress || { lat: "", lng: "" };
    const { lat, lng } = address;
    const distance = getDistance(latitude, longitude, lat, lng, unit);
    const hourMode = _.get(item, `newBusinessHours.mode`, null);
    const reviewMode = _.get(item, `oReview.mode`, 10);
    const addressLocation = _.get(item, `oAddress.address`, "");
    const isOpen =
      hourMode === "open_for_selected_hours"
        ? getBusinessStatus(
            item.newBusinessHours.operating_times,
            item.newBusinessHours.timezone
          )
        : hourMode;
    return (
      <ListingItem
        image={item.oFeaturedImg.large}
        title={he.decode(item.postTitle)}
        translations={translations}
        claimStatus={item.claimStatus === "claimed"}
        tagline={item.tagLine ? he.decode(item.tagLine) : null}
        logo={!!item.logo ? item.logo : item.oFeaturedImg.thumbnail}
        location={he.decode(addressLocation)}
        reviewMode={reviewMode}
        reviewAverage={item.oReview.averageReview}
        businessStatus={isOpen}
        colorPrimary={settings.colorPrimary}
        onPress={() =>
          navigation.navigate("ListingDetailScreen", {
            id: item.ID,
            name: he.decode(item.postTitle),
            tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
            link: item.postLink,
            author: item.oAuthor,
            image: item.oFeaturedImg.large,
            logo: item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail,
          })
        }
        layout={this.props.horizontal ? "horizontal" : "vertical"}
        isFooterAutoDisable={isFooterAutoDisable}
        mapDistance={distance}
        {...style}
      />
    );
  };

  _getWithLoadingProps = (loading) => ({
    isLoading: loading,
    contentLoader: "content",
    contentHeight: 90,
    contentLoaderItemLength: 6,
    featureRatioWithPadding: "56.25%",
    column: 2,
    gap: 10,
    containerPadding: 10,
  });

  renderContentSuccess(listings) {
    const { startLoadmore } = this.state;
    return (

      <FlatList
        data={listings.oResults}
        renderItem={this.renderItem({})}
        keyExtractor={(item, index) => item.ID.toString()}
        numColumns={this.props.horizontal ? 1 : 2}
        horizontal={this.props.horizontal}
        showsHorizontalScrollIndicator={false}
        onEndReached={this._handleEndReached(listings.next, listings.totalPage)}
        ListFooterComponent={() =>
          startLoadmore && listings.next !== false ? (
            <View
              style={{
                marginLeft: (SCREEN_WIDTH - screenWidth) / 2,
              }}
            >
              <View style={{ padding: 5, width: screenWidth - 10 }}>
                <Row gap={10}>
                  {Array(2)
                    .fill(null)
                    .map((_, index) => (
                      <Col key={index.toString()} column={2} gap={10}>
                        <ContentLoader
                          featureRatioWithPadding="56.25%"
                          contentHeight={90}
                          content={true}
                        />
                      </Col>
                    ))}
                </Row>
              </View>
            </View>
          ) : (
            <View style={{ paddingBottom: 20 + bottomBarHeight }} />
          )
        }
        style={{ padding: 5 }}
        columnWrapperStyle={{
          width: screenWidth,
          marginLeft: (SCREEN_WIDTH - screenWidth) / 2,
        }}
      />
    );
  }

  renderContentError(listings) {
    const { translations } = this.props;
    return listings && <MessageError message={translations.noPostFound} />;
  }

  _getIconMapMarkerColor = (status, colorPrimary) => {
    switch (status) {
      case "open":
        return colorSecondary;
      case "close":
        return colorQuaternary;
      default:
        return colorPrimary;
    }
  };

  _handleGetCurrentItem = (item) => {
    this.setState({
      itemCurrentSlideID: item.ID,
    });
  };

  _handleToggleMapView = () => {
    const { isMapVisibleAnimated, isMapVisible } = this.state;
    Animated.timing(isMapVisibleAnimated, {
      toValue: !isMapVisible ? 100 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start(async () => {
      await wait(!isMapVisible ? 300 : 0);
      await this.setState({
        isMapVisible: !isMapVisible,
        aceptar: false
      });
    });
  };



  _renderMapMarker = ({ item }) => {
    const { itemCurrentSlideID } = this.state;
    const { settings } = this.props;

    return (
      <IconMapMarker
        isFocus={itemCurrentSlideID === item.ID}
        imageUri={!!item.logo ? item.logo : item.oFeaturedImg.thumbnail}
        backgroundTintColor={settings.colorPrimary} // item.businessStatus không trả về nên không thể dùng method _getIconMapMarkerColor
      />
    );
  };

  _getTranslateStyle = () => {
    const { isMapVisibleAnimated } = this.state;
    return isMapVisibleAnimated.interpolate({
      inputRange: [0, 100],
      outputRange: [screenHeight, 0],
      extrapolate: "clamp",
    });
  };

  _getDataForMap = () => {
    const { listings } = this.props;
    const { postType } = this.state;
    const oResults = _.get(listings, `${postType}.oResults`, []);
    const results = oResults.filter((item) => !!item.oAddress.address);
    return !_.isEmpty(results) ? getCoordinateFromListItem(results) : [];
  };

  _renderMapView = () => {
    const { listings, loading, settings } = this.props;
    const { postType, isMapVisible } = this.state;
    const data = this._getDataForMap();

    return (
      <Animated.View
        style={[
          styles.mapSliderWrap,
          {
            transform: [{ translateY: this._getTranslateStyle() }],
          },
        ]}
      >
        {!loading && isMapVisible ? (
          !_.isEmpty(data) ? (
            <MapSlider
              data={data}
              renderItem={this.renderItem(
                {
                  containerStyle: {
                    width: "100%",
                  },
                  featureImageWidth: "100%",
                },
                false
              )}
              onEndReached={this._handleEndReached(listings[postType].next)}
              mapMarkerKeyExtractor={(item) => item.ID.toString()}
              renderMapMarker={this._renderMapMarker}
              getCurrentItem={this._handleGetCurrentItem}
              mapZoom={settings.defaultMapZoom}
            />
          ) : (
            this.renderContentError(listings[postType])
          )
        ) : (
          <Loader size="small" />
        )}
      </Animated.View>
    );
  };

  _renderButtonMapViewToggle = () => {
    const { settings } = this.props;
    const { isMapVisible } = this.state;
    return (
      <TouchableHighlight
        activeOpacity={0.9}
        underlayColor="#fff"
        onPress={this._handleToggleMapView}
        style={styles.openMapView}
      >
        {!isMapVisible ? (
          <FontIcon
            name="fa fa-map-marker"
            size={35}
            color="#ffff"
          />
        ) : (
          
          <FontIcon
            name="fa fa-th-large"
            size={35}
            color="#ffff"
          />
        )}
      </TouchableHighlight>
    );
  };

  aceptargps() {
    this.setState({
      aceptar: false
    });
    AsyncStorage.setItem("gps",JSON.stringify(this.state.aceptar));
  }

  _renderGrid = (condition) => {
    const {
      listings,
      isListingRequestTimeout,
      loading,
      translations,
      navigation,
    } = this.props;
    const { postType } = this.state;
    return (

      <View style={{ flex: 1, width: loading ? screenWidth : SCREEN_WIDTH }}>

        <ViewWithLoading {...this._getWithLoadingProps(loading)}>
          <RequestTimeoutWrapped
            isTimeout={isListingRequestTimeout && _.isEmpty(listings[postType])}
            onPress={this._getListing}
            fullScreen={true}
            style={styles.requestTimeout}
            text={translations.networkError}
            buttonText={translations.retry}
          >
            {condition
              ? this.renderContentSuccess(listings[postType])
              : this.renderContentError(listings[postType])}
          </RequestTimeoutWrapped>
        </ViewWithLoading>
      </View>
    );
  };

  render() {
    const { listings } = this.props;
    const { postType, isMapVisible, aceptar } = this.state;
    const condition = this._getListingSuccess(listings, postType);
    return (
      <View style={[styles.container]}>
      {this.state.aceptar &&
    
      <View style={[styles.aviso]}>
      <View style={[styles.triaviso]} />
      
      <View style={[styles.globoaviso]}>
        <FontIcon
            name="fa fa-map-marker"
            size={15}
            color="#ffff"
            style={{right: 4}}
          />
      <Text style={[styles.textaviso]}>Enciende tu GPS para una mejor experiencia!</Text>
    
      <TouchableOpacity onPress={()=>this.aceptargps()} style={{
                 backgroundColor:"#FFD200",
                 
                 alignItems:'center',
                 padding:7,
   
                 borderRadius:3

               }}>
               <Text style={{fontSize:12}}>Aceptar</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={()=>this.setState({aceptar:false}) } style={[styles.xaviso]} >
                <FontIcon
            name="fa fa-close"
          size={17}
            color="#ffff"
            
          />
          </TouchableOpacity>
 
      </View>
   
      </View>
     }
        {this._renderMapView()}
        {!isMapVisible && this._renderGrid(condition)}
        {condition &&
          !_.isEmpty(this._getDataForMap()) &&
          this._renderButtonMapViewToggle()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  containerFull: {
    width: SCREEN_WIDTH,
  },
  openMapView: {
    position: "absolute",
    bottom: -14 + bottomBarHeight, //bottom era 4
    zIndex: 15,
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 15,
  },
  aviso: {

    width: SCREEN_WIDTH,
    height: 70,
    top:-13,
    backgroundColor: "black",

    justifyContent: "center",
    alignItems: "center"
  },
  globoaviso: {
    width: SCREEN_WIDTH - 15,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    flexDirection: "row",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 15,
  },
  triaviso: {
    right: 160,

     backgroundColor: 'transparent',
     borderStyle: 'solid',
     borderTopWidth: 0,
     borderRightWidth: 5,
     borderBottomWidth: 10,
     borderLeftWidth: 5,
     borderTopColor: 'transparent',
     borderRightColor: 'transparent',
     borderBottomColor: "#000000",
     borderLeftColor: 'transparent',
   },
   xaviso: {
    color: "#FFFFFF",
    padding: 1,
    marginLeft: 14

  },
  textaviso: {
    color: "#FFFFFF",
    fontSize: 11,
    marginLeft: 4,
    marginRight: 8

  },
  requestTimeout: {
    flex: 1,
    flexDirection: "row",
  },
  mapSliderWrap: {
    backgroundColor: colorGray1,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9,
    width: "100%",
    height: "100%",
  },
  iconOpenMapView: {
    width: 12,
    height: 12,
    top: 12,
    left: 12,
  },
  logoraro: {
    width: 36,
    height: 36,
   
  },
});

const mapStateToProps = (state) => ({
  listings: state.listings,
  loading: state.loading,
  locationList: state.locationList,
  categoryList: state.categoryList,
  isListingRequestTimeout: state.isListingRequestTimeout,
  nearByFocus: state.nearByFocus,
  locations: state.locations,
  translations: state.translations,
  settings: state.settings,
});

const mapDispatchToProps = {
  getListings,
  getListingsLoadmore,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListingsContainer);

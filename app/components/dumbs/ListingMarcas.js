import React, { PureComponent } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import { LinearGradient } from "expo-linear-gradient";
import {
  screenWidth,
  colorDark1,
  colorGray1,
  ra,
  round,
  colorGray3,
} from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import { Row, Col, ImageCover, FontIcon, getBusinessStatus, adMobModal } from "../../wiloke-elements";
import _ from "lodash";
import he from "he";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import ListingItem from '../dumbs/ListingItem';
import { getDistance } from '../../utils/getDistance';

export default class ListCatNow extends PureComponent {
  static propTypes = {
    cat: PropTypes.array,
    containerStyle: PropTypes.object,
  };

  state = {
    data: [],
        currentStepIndex: '',
        selectCatg: 1
  };

  mapDataToCategories = () => {
    const { cat } = this.props;
    if(this.props.nuevo){
      cat.sort((a, b) => {
        return a.ID > b.ID
      });
    }
    const res = cat
      .reduce((newArr, item, index) => {
        const length = cat.length;
        let catDouble = [];
        if (index <= length - 1) {
          if (index % 2 === 0) {
            catDouble = !!cat[index + 1]
              ? [cat[index], cat[index + 1]]
              : [cat[index]];
          }
        }
        return [...newArr, catDouble];
      }, [])
      .filter((i) => !_.isEmpty(i));
    return res;
  };

  componentDidMount() {
    this.setState({
      data: this.mapDataToCategories(),
    });
  }

  _navigate = item => {
    const { navigation, postType } = this.props;

    navigation.navigate('ListingDetailScreen', {
      id: item.ID,
      name: he.decode(item.postTitle),
      tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
      link: item.postLink,
      author: item.oAuthor,
      image: item.oFeaturedImg.large,
      logo: item.logo !== '' ? item.logo : item.oFeaturedImg.thumbnail,
      postType,
    });
  };
  
  _renderCatItem = ({ item }) => {
    const { navigation, myCoords, unit, translations } = this.props;

    const address = item.oAddress || { lat: '', lng: '' };
    const { lat, lng } = address;
    const latitude = 0;
    const longitude = 0;
    const distance = getDistance(latitude, longitude, lat, lng, unit);
    const hourMode = _.get(item, `newBusinessHours.mode`, null);
    const reviewMode = _.get(item, `oReview.mode`, 10);
    const addressLocation = _.get(item, `oAddress.address`, '');
    const isOpen =
      hourMode === 'open_for_selected_hours'
        ? getBusinessStatus(item.newBusinessHours.operating_times, item.newBusinessHours.timezone)
        : hourMode;
    return (
      <ListingItem
        image={item.oFeaturedImg.large}
        title={he.decode(item.postTitle)}
        translations={translations}
        claimStatus={item.claimStatus === 'claimed'}
        tagline={item.tagLine ? he.decode(item.tagLine) : null}
        claimStatus={item.claimStatus === 'claimed'}
        logo={item.logo !== '' ? item.logo : item.oFeaturedImg.thumbnail}
        location={he.decode(addressLocation)}
        reviewMode={reviewMode}
        reviewAverage={item.oReview.averageReview}
        businessStatus={isOpen}
        colorPrimary={this.props.colorPrimary}
        onPress={this._handlePress(item)}
        layout={this.props.layout}
        mapDistance={distance}
      />
    );
  };

  _handlePress = item => async () => {
    const { admob } = this.props;
    const isAdmob = _.get(admob, 'oFullWidth', false);
    !!isAdmob && adMobModal({ variant: admob.oFullWidth.variant });
    this._navigate(item);
  };

  renderItem = ({ item, index }) => {
    return (
      <View
        style={[styles.item, { width: screenWidth / 1.7, height: "100%" }]}
      >
        <FlatList
          data={item}
          renderItem={this._renderCatItem}
          keyExtractor={(item, index) => index.toString() + "__categoryItem"}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
        
      </View>
    );
  };

  scrollToIndex = () => {
    
    this.flatListRef.scrollToIndex({animated: true, index: 0});
    this.setState({
              selectCatg: 1
            });
  }
  scrollToFinal = () => {
    const { navigation } = this.props;
    navigation.navigate("HomeNueva", {
    });
  }
  getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )

  render() {
    const { cat, containerStyle } = this.props;
    const { data } = this.state;
    
    console.log(data);

    return (
      <View style={styles.container}>
      
        <SwiperFlatList
      autoplay
      autoplayDelay={3}
      autoplayLoop
      autoplayLoopKeepAnimation
      data={data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString() + "__category"}
getItemLayout={this.getItemLayout}
    />
       
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    
  },
  item: {
    marginHorizontal: 5,
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 85.5,

  },
  text: {
    color: "#fff",
    
  },
  name: {
    flex: 1,
  },
  openMapView: {

    right: 10,
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: "#E60000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 15,
  },
  catItem: {
    alignItems: "center",
     width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 11,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
  },
});

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
} from "../../../constants/styleConstants";
import stylesBase from "../../../stylesBase";
import { Row, Col, ImageCover, FontIcon } from "../../../wiloke-elements";
import _ from "lodash";
import he from "he";
import { SwiperFlatList } from 'react-native-swiper-flatlist';


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

  _handleItem = (item) => () => {
    const { navigation } = this.props;
        navigation.navigate("ListingCategories", {
      categoryId: item.oTerm.term_id,
      name: he.decode(item.oTerm.name),
      taxonomy: 'listing_cat',
      endpointAPI: 'list/listings',
    });

  };
  

  _renderCatItem = ({ item, index }) => {
    return (
      <View style={[styles.container]}>
      <TouchableOpacity
        style={[index === 0 ]}
        onPress={this._handleItem(item)}
      >
        <View style={styles.box}>
          <ImageCover
            src={item.oTerm.featuredImg}
            width="100%"
            overlay={0.50}
            borderRadius={10}
            linearGradient="0,0,0"
            modifier="16by9"
          />
          <View style={[stylesBase.absFull, styles.name]}>
          <Text style={[stylesBase.h6, styles.text]}>{he.decode(item.oTerm.name)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <View
        style={[styles.item, { width: screenWidth / 3, height: "100%" }]}
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

    return (
      <View style={[containerStyle]}>
      

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
    position: "relative",
    zIndex: 9,
    overflow: "hidden",
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

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
import {
  screenWidth,
  colorDark1,
  colorGray1,
  round,
  colorGray3,
} from "../../../constants/styleConstants";
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
    datavieja: [],
        currentStepIndex: '',
        selectCatg: 1
  };

  mapDataToCategories = () => {
    const cat = this.state.datavieja;
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
    if(this.state.selectCatg){
    return fetch("http://appspuntaltenses.com/paya/subcategorias.php",{
      method:'post',
      header:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify({
        // we will pass our input data to server
        id: 1
        

      })
      
    })
    .then((response)=> response.json())
    .then((responseJson)=>{
      this.setState({
        datavieja: responseJson.Hoy,
        isLoading:false
      })
      this.setState({
      data: this.mapDataToCategories(),
    });
    })
    .catch((error)=>{
      console.log(error)
    })
  }
    
  }

  _handleItem = (item) => () => {
    const { navigation } = this.props;
    navigation.push("ListingCategories", {
      categoryId: item.termid,
      name: he.decode(item.name),
      taxonomy: 'listing_cat',
      endpointAPI: 'list/listings',
    });
  };
  

  _renderCatItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.catItem, index === 0 && { paddingBottom: 20 }]}
        onPress={this._handleItem(item)}
      >
        <View style={styles.box}>
          <ImageCover
            src={item.icon}
            width="100%"
          />
        </View>
        <Text style={styles.name}>{he.decode(item.name)}</Text>
      </TouchableOpacity>
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <View
        style={[styles.item, { width: screenWidth / 4 - 10, height: "100%" }]}
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
        ref={(ref) => { this.flatListRef = ref; }}
          autoplay
          autoplayDelay={2}
          autoplayLoop
          autoplayLoopKeepAnimation
          data={data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString() + "__category"}
          horizontal={true}
          getItemLayout={this.getItemLayout}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  item: {
    marginHorizontal: 5,
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
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
  },
  name: {
    fontSize: 11,
    fontWeight: "500",
  },
});

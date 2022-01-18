import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity,FlatList, Image } from "react-native";
import Carousel from "react-native-snap-carousel";
import he from "he";
import * as WebBrowser from "expo-web-browser";
import PropTypes from "prop-types";
import { screenWidth } from "../../../constants/styleConstants";
import { Image2, RTL } from "../../../wiloke-elements";
import { SwiperFlatList } from 'react-native-swiper-flatlist';

// import { Image as ImageCache } from "react-native-expo-image-cache";

export default class Banner extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
  };
  static defaultProps = {
    data: [],
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  _handlePressItem = (item) => async () => {
    const { type, navigation } = this.props;
    if (type === "EXTERNAL_BANNERS" && !!item.link_to) {
      WebBrowser.openBrowserAsync(item.link_to);
      return;
    }
    navigation.navigate("ListingDetailScreen", {
      id: item.postID,
      name: he.decode(item.oListing.postTitle),
      tagline: !!item.oListing.tagLine
        ? he.decode(item.oListing.tagLine)
        : null,
      link: item.oListing.postLink,
      author: item.oListing.oAuthor,
      image: item.oListing.oFeaturedImg.large,
      logo:
        item.oListing.logo !== ""
          ? item.oListing.logo
          : item.oListing.oFeaturedImg.thumbnail,
    });
  };

  _renderItem = ({ item, index }) => {
    const preview = {
      uri: item.image,
    };
    const uri = item.image;
    return (
      <TouchableOpacity activeOpacity={1} onPress={this._handlePressItem(item)}>
        <View style={{ marginLeft:6, marginRight: 6 }}>
            <Image
            style={{ height:100,width: screenWidth/1.05,borderRadius:25, }}
            source={{
          uri: uri}}
         resizeMode="cover"  />
            </View>
      </TouchableOpacity>
  
    );
  };


  componentDidMount(){
    if(this.props.es === 'NADA'){
    return fetch("http://appspuntaltenses.com/paya/comercial.php",{
      method:'post',
      header:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify({
        // we will pass our input data to server
        id: this.props.navigation.state.params.name
        

      })
      
    })
    .then((response)=> response.json())
    .then((responseJson)=>{
      console.log(this.props.navigation.state.params.name);
      this.setState({
        data: responseJson.Hoy,
        isLoading:false
      })
    })
    .catch((error)=>{
      console.log(error)
    })
  }
  }

  render() {
    let data;
    if(this.props.es === 'SI'){
      data = this.props.data;
    } else {
    data = this.state.data;
  }
    return (
      <View style={[styles.container]}>

      <SwiperFlatList
      autoplay
      autoplayDelay={2}
      autoplayLoop
      autoplayLoopKeepAnimation
      data={RTL() ? data.reverse() : data}
      renderItem={this._renderItem}
      keyExtractor = { (item,index) => index.toString() }
    />
        

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {justifyContent: 'center',
    alignItems: 'center'},
  image: {
    borderRadius: 25,
  },
});

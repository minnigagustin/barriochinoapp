import React, { Component } from "react";
import {
  View,
  RefreshControl,
  AppState,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  TextInput
} from "react-native";
import * as Linking from "expo-linking";
import WebView from "react-native-webview";
import { FlatList } from "react-native-gesture-handler";
import {
  ViewWithLoading,
  RequestTimeoutWrapped,
  Admob,
  adMobModal,
  Row,
  Col,
  Masonry,
  Loader,
  RTL,
  wait,
  // MyAdvertise
} from "../../wiloke-elements";
import {
  Heading,
  Hero,
  Layout,
  ListingLayoutHorizontal,
  ListingLayoutPopular,
  ListingLayoutCat,
  ListingCat,
  EventItem,
  PostTypeCard,
  CommentItem,
  ProductItem,
  ProductsWC,
  ListingCarousel,
  ProductCarousel,
} from "../dumbs";
import he from "he";
import { connect } from "react-redux";
import {
  getHomeScreen,
  getTabNavigator,
  getShortProfile,
  readNewMessageChat,
  getKeyFirebase,
} from "../../actions";
import _ from "lodash";
import * as Consts from "../../constants/styleConstants";
import * as Notifications from "expo-notifications";
import { getDistance } from "../../utils/getDistance";
import Banner from "../dumbs/Banner/Banner";
import NavigationSuspense from "../smarts/NavigationSuspense";
import {
  AdMobInterstitial,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from "expo-ads-admob";
import ListCatNow from "../dumbs/ListingCategoriesNow/ListCatNow";
import WilTab from "../../wiloke-elements/components/molecules/WilTab";
import ListingTabs from "../dumbs/ListingCarousel/ListingTabs";
import deeplinkListener from "../../utils/deeplinkListener";

const ITEM_HEIGHT = 500;

const SCREEN_WIDTH = Consts.screenWidth;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.refreshing = false;
    this.state = {
      appState: AppState.currentState,
      notification: null,
      animationType: "none",
    };
  }

 
  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    const DATA = [
    {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    imagen: 'https://pidepaya.com/wp-content/uploads/2021/01/the-chicken-sandwich-300x200.jpg',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    imagen: 'https://pidepaya.com/wp-content/uploads/2021/01/krispy-toro-300x200.jpg',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    imagen: 'https://pidepaya.com/wp-content/uploads/2021/01/anti-burguer-1-300x200.jpg',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/McDonald%27s_logo.svg/2560px-McDonald%27s_logo.svg.png',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    imagen: 'https://pidepaya.com/wp-content/uploads/2021/01/the-chicken-sandwich-300x200.jpg',
  },
];
    return (
      <ScrollView style={{ flex: 1,backgroundColor:"white", paddingTop: 45}}>
      <View style={{marginBottom: 15,flexDirection:'row', width: SCREEN_WIDTH }}>
      <View style={{ left: 20}}>
      <Image
            style={{ height:36,width: 71 }}
            source={require("./Logo.png")}
         resizeMode="cover"  />
      </View>

      <View style={{position: 'absolute',right: 20,flexDirection:'row'}}>
      <Image
            style={{ height:40,width: 45 }}
            source={require("./logos/noti.png")}
         resizeMode="cover"  />
         <Image
            style={{ height:40,width: 45 }}
            source={require("./logos/ubi.png")}
         resizeMode="cover"  />
         <Image
            style={{ height:40,width: 45 }}
            source={require("./logos/perfil.png")}
         resizeMode="cover"  />
      </View>
      </View>
      <View style={{marginBottom: 8}}>
      <TextInput
              placeholder="Realiza tu busqueda"
              style={{ width:335,height: 40,left: 10,backgroundColor: '#F5F5F5', borderColor: '#f2f2f2', borderRadius:10, borderWidth: 1, paddingHorizontal:20 }}
            />
            </View>
            <View>
      <FlatList
              horizontal={true}
              data={DATA}
              renderItem={({ item }) => this._renderItemFood(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
            </View>
            <View>
  
            <FlatList
              horizontal={true}
              data={DATA}
              renderItem={({ item }) => this._renderItemCategoria(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
            <FlatList
              horizontal={true}
              data={DATA}
              renderItem={({ item }) => this._renderItemCategoriaDos(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
            </View>
            <View>
            <FlatList
              horizontal={true}
              data={DATA}
              renderItem={({ item }) => this._renderItemPubli(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
            </View>
            <View>
            <Text style={{fontWeight:'bold',fontSize:18,textAlign:'left',marginLeft: 10}}>
              Barrio Chino - Lo mas popular
            </Text>
            <FlatList
              horizontal={true}
              data={DATA}
              renderItem={({ item }) => this._renderItemComercio(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
            </View>
            <View>
            <Text style={{fontWeight:'bold',fontSize:18,textAlign:'left',marginLeft: 10}}>
              Kosher Alley
            </Text>
            <FlatList
              horizontal={true}
              data={DATA}
              renderItem={({ item }) => this._renderItemComercio(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
            </View>
            <View>
            <Text style={{fontWeight:'bold',fontSize:18,textAlign:'left',marginLeft: 10}}>
              Green Site
            </Text>
            <FlatList
              horizontal={true}
              data={DATA}
              renderItem={({ item }) => this._renderItemComercio(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
            </View>
            <View>
            <Text style={{fontWeight:'bold',fontSize:18,textAlign:'left',marginLeft: 10}}>
              Green Site
            </Text>
            <FlatList
              horizontal={true}
              data={DATA}
              renderItem={({ item }) => this._renderItemComercio(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
            </View>
            </ScrollView>
    );
  }
  _renderItemFood(item){
    
      return(
      <View style={{ margin:6 }}>
            <Image
            style={{ height:76,width: 76,borderRadius:38, }}
            source={{
          uri: item.imagen}}
         resizeMode="cover"  />
            </View>
     
        )
    
  }

  _renderItemPubli(item){
    
      return(
      <View style={{ margin:6 }}>
            <Image
            style={{ height:135,width: SCREEN_WIDTH/1.3,borderRadius:25, }}
            source={require("./publi.png")}
         resizeMode="cover"  />
            </View>
     
        )
    
  }


  _renderItemComercio(item){
    
      return(
      <View style={{ margin:6 }}>
            <Image
            style={{ width: 175,
height: 123,borderRadius:25, }}
            source={require("./comercio.png")}
         resizeMode="cover"  />
            </View>
     
        )
    
  }


  _renderItemCategoria(item){
    
      return(
      <View style={{ margin:6 }}>
            <Image
            style={{ width: 133.84,
height: 92.5,borderRadius:25, }}
            source={require("./categoria.png")}
         resizeMode="cover"  />
            </View>
     
        )
    
  }

  _renderItemCategoriaDos(item){
    
      return(
      <View style={{ margin:6 }}>
            <Image
            style={{ width: 133.84,
height: 92.5,borderRadius:25, }}
            source={require("./categoria.png")}
         resizeMode="cover"  />
            </View>
     
        )
    
  }


}

const styles = StyleSheet.create({
  contentInner: {
    width: SCREEN_WIDTH,
    // paddingBottom: Platform.OS === "ios" ? 0 : 10,
  },
  heading: {
    paddingTop: 5,
    paddingHorizontal: 10,
    paddingBottom: 5,
    alignItems: "flex-start",
    direction: "inherit",
  },
  listing: {
    paddingBottom: 1,
  },
  categories: {
    paddingTop: 5,
    paddingBottom: 1,
  },
  itemEvents: {
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  events: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  reviews: {
    paddingTop: 10,
    paddingBottom: 20,
  },
});

const mapStateToProps = (state) => ({
  homeScreen: state.homeScreen,
  translations: state.translations,
  isHomeRequestTimeout: state.isHomeRequestTimeout,
  settings: state.settings,
  tabNavigator: state.tabNavigator,
  auth: state.auth,
  keyFirebase2: state.keyFirebase2,
  keyFirebase: state.keyFirebase,
  shortProfile: state.shortProfile,
  deviceToken: state.deviceToken,
  notificationAdminSettings: state.notificationAdminSettings,
  loginError: state.loginError,
  listings: state.listings,
  locations: state.locations,
});

const mapDispatchToProps = {
  getHomeScreen,
  getTabNavigator,
  getShortProfile,
  readNewMessageChat,
  getKeyFirebase,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

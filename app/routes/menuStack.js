import { createStackNavigator } from "react-navigation-stack";
import stackOpts from "./stackOpts";
import * as Consts from "../constants/styleConstants";
import MenuScreen from "../components/screens/MenuScreen";
import EventScreen from "../components/screens/EventScreen";
import ListingScreen from "../components/screens/ListingScreen";
import BlogScreen from "../components/screens/ArticleScreen";
import ArticleScreen from "../hsblog/containers/TabPostsScreen/TabPostsScreen";
import PageScreen2 from "../components/screens/PageScreen2";
import HomeScreen from "../components/screens/HomeScreen";
import configureApp from "../../configureApp.json";

const menuStack = createStackNavigator(
  {
    // MenuScreen: {
    //   screen: MenuScreen
    //   // navigationOptions: {
    //   //   title: "Wilcity",
    //   //   headerStyle: {
    //   //     backgroundColor: Consts.colorDark
    //   //   },
    //   //   headerTintColor: Consts.colorPrimary,
    //   //   headerTitleStyle: {
    //   //     fontWeight: "400",
    //   //     fontSize: 14
    //   //   }
    //   // }
    //   // navigationOptions: ({ navigation }) => ({
    //   // 	header: false
    //   // })
    // },
    MenuHomeScreen: {
      screen: MenuScreen,
    },
    MenuEventScreen: {
      screen: EventScreen,
    },
    MenuListingScreen: {
      screen: ListingScreen,
    },
    MenuBlogScreen: {
      screen: !!configureApp.apiHighSpeedBlog ? ArticleScreen : BlogScreen,
    },
    MenuPageScreen: {
      screen: PageScreen2,
    },
  },
  stackOpts
);

export default menuStack;

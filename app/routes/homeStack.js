import { createStackNavigator } from "react-navigation-stack";
import { Dimensions } from "react-native";
import stackOpts from "./stackOpts";
import HomeScreen from "../components/screens/HomeScreen";
import ListingScreen from "../components/screens/ListingScreen";
import EventScreen from "../components/screens/EventScreen";
import HomeNueva from "../components/screens/HomeNueva";
import PageScreen2 from "../components/screens/PageScreen2";
import ListingCategories from "../components/screens/ListingCategories";
import ListingDetailScreen from "../components/screens/ListingDetailScreen";
const { width } = Dimensions.get("window");
const homeStack = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen
    },
    ListingCategories: {
      screen: ListingCategories,
     // navigationOptions: ({ navigation }) => ({
       // gesturesEnabled: true,
        //gestureResponseDistance: {
         // horizontal: width
       // }
     // })
    },
    HomeNueva: {
      screen: HomeNueva
    },
    ListingScreenStack: {
      screen: ListingScreen
    },
    ListingDetailScreen: {
      screen: ListingDetailScreen
    },

PageScreen2: {
          screen: PageScreen2,
        },
    EventScreenStack: {
      screen: EventScreen
    }
  },
  stackOpts
);

export default homeStack;

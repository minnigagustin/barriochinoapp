import { createStackNavigator } from "react-navigation-stack";
import stackOpts from "./stackOpts";
import ListingScreen from "../components/screens/ListingScreen";
import ListingDetailScreen from "../components/screens/ListingDetailScreen";

const listingStack = createStackNavigator(
  {
    ListingScreen: {
      screen: ListingScreen,
      },
      ListingDetailScreen: {
          screen: ListingDetailScreen
        },
      // navigationOptions: {
      // 	title: 'Wilcity',
      // 	headerStyle: {
      // 		backgroundColor: Consts.colorDark,
      // 	},
      //     headerTintColor: Consts.colorPrimary,
      //     headerTitleStyle: {
      //         fontWeight: '400',
      //         fontSize: 14,
      //     },
      // }
  
    // LISTING_DETAIL: {
    // 	screen: ListingDetail
    // },
  },
  stackOpts
);

export default listingStack;

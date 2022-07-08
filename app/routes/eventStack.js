import { createStackNavigator } from "react-navigation-stack";
import stackOpts from "./stackOpts";
import * as Consts from "../constants/styleConstants";
import EventScreen from "../components/screens/EventScreen";
import EventDetailScreen from "../components/screens/EventDetailScreen";

const eventStack = createStackNavigator(
  {
    EventScreen: {
      screen: EventScreen
    },
    EventDetailScreen: {
      screen: EventDetailScreen,
    },
  },
  stackOpts
);

export default eventStack;

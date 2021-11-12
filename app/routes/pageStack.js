import { createStackNavigator } from "react-navigation-stack";
import stackOpts from "./stackOpts";
import PageScreen2 from "../components/screens/PageScreen2";

const pageStack = createStackNavigator(
  {
    PageScreen2: {
      screen: PageScreen2,
    },
  },
  stackOpts
);

export default pageStack;

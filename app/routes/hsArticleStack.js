import { createStackNavigator } from "react-navigation-stack";
import stackOpts from "./stackOpts";
import * as Consts from "../constants/styleConstants";
import ArticleScreen from "../hsblog/containers/TabPostsScreen/TabPostsScreen";

const hsArticleStack = createStackNavigator(
  {
    ArticleScreen: {
      screen: ArticleScreen,
    },
  },
  stackOpts
);

export default hsArticleStack;

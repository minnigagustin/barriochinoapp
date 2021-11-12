import { categories } from "./storeCategories/reducers/reducerCategories";
import reducerCommentScreen from "../containers/CommentScreen/reducers/reducers";
import reducerPostDetailScreen from "../containers/PostDetailScreen/reducers/reducers";
import reducerPostsScreen from "../containers/PostsScreen/reducers/reducers";
import reducerTabPostsScreen from "../containers/TabPostsScreen/reducers/reducers";
import reducerSearchScreen from "../containers/SearchScreen/reducers/reducers";
import { categoriesSelected } from './storeCategories/reducers/reducerCatSelected';
const reducers = {
    categories,
    categoriesSelected,
    ...reducerCommentScreen,
    ...reducerPostDetailScreen,
    ...reducerPostsScreen,
    ...reducerTabPostsScreen,
    ...reducerSearchScreen,
};
export default reducers;

import PostDetailScreen from "../containers/PostDetailScreen/PostDetailScreen";
import SearchScreen from "../containers/SearchScreen/SearchScreen";
import PostsScreen from "../containers/PostsScreen/PostsScreen";
import CommentScreen from "../containers/CommentScreen/CommentsScreen";
import ReplyScreen from "../containers/CommentScreen/ReplyScreen";
// RootTab
export const rootTabNavigators = {};
// Stack ngang hàng với RootTab
export const rootStackNavigators = {
    SearchScreen,
    Comments: CommentScreen,
    PostsScreen,
    PostDetailNotGetureDistance: PostDetailScreen,
    ReplyScreen,
};

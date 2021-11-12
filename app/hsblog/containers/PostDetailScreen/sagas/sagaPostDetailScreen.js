import watchDetailContent from './watchDetailContent';
import { watchRelatedPosts, watchRelatedPostsCancel } from './watchRelatedPosts';
import { watchPostFavorite } from './watchPostFavorite';
import { watchPostView, watchPostViewCancel } from './watchPostView';
import { watchGetFavorite } from './watchGetFavorite';
const sagaPostDetailScreen = [
    watchDetailContent,
    watchGetFavorite,
    watchRelatedPosts,
    watchRelatedPostsCancel,
    watchPostFavorite,
    watchPostView,
    watchPostViewCancel,
];
export default sagaPostDetailScreen;

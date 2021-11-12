import watchSearchMounted from "./watchSearchMounted";
import watchTrendingPosts from "./watchTrendingPosts";
import watchSearchChange from "./watchSearchChange";
const sagaSearchScreen = [watchSearchMounted, watchTrendingPosts, watchSearchChange];
export default sagaSearchScreen;

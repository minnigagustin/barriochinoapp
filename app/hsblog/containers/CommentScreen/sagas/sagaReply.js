import watchGetReply from './sagaReply/watchGetReply';
import watchAddNewReply from './sagaReply/watchAddNewReply';
import watchDelReply from './sagaReply/watchDeleteReply';
import watchEditReply from './sagaReply/watchEditReply';
const sagaReply = [watchGetReply, watchAddNewReply, watchDelReply, watchEditReply];
export default sagaReply;

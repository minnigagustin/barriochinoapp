import watchGetComments from './sagaComments/watchGetComments';
import watchDeleteComment from './sagaComments/watchDeleteComment';
import watchAddNewComment from './sagaComments/watchAddNewComment';
import watchEditComment from './sagaComments/watchEditComment';
const sagaComments = [watchGetComments, watchDeleteComment, watchAddNewComment, watchEditComment];
export default sagaComments;

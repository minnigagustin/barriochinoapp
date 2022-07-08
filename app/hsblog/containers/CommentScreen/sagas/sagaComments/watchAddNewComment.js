import { call, put, select, takeLeading } from 'redux-saga/effects';
import fetchAPI from "../../../../utils/functions/fetchAPI";
import { getActionType } from "../../../../utils/functions/reduxActions";
import { postNewComment, postNewCommentOffline, deleteCommentOffline } from '../../actions/actionComments';
function* handleAddComment({ payload }) {
    const auth = yield select((state) => state.auth);
    const comment = {
        id: payload.body.id ?? Date.now(),
        title: '',
        author: {
            id: auth.data.id ?? Date.now(),
            displayName: auth.data.displayName ?? '',
            avatar: auth.data.avatar ?? '',
            email: auth.data.email ?? '',
        },
        description: payload.body.comment,
        childComments: [],
        childCommentTotal: 0,
        timestamp: Date.now() / 1000,
        date: '',
    };
    try {
        if (!payload.body.id) {
            yield put(postNewCommentOffline(comment));
        }
        payload?.cb?.();
        const res = yield call(fetchAPI.request, {
            method: 'POST',
            url: payload.endpoint,
            data: { ...payload.body },
        });
        yield put(deleteCommentOffline(comment.id));
        yield put(postNewComment.success({ status: res.data.status, data: res.data.data }));
    }
    catch (err) {
        console.log(err.response);
        // yield put(deleteCommentOffline(comment.id));
        yield put(postNewComment.failure('Sorry your comment is not added'));
        yield put(postNewCommentOffline({ ...comment, approved: 'failure' }));
    }
}
function* watchAddNewComment() {
    yield takeLeading(getActionType(postNewComment.request), handleAddComment);
}
export default watchAddNewComment;

import { call, put, select, takeLeading } from 'redux-saga/effects';
import fetchAPI from "../../../../utils/functions/fetchAPI";
import { getActionType } from "../../../../utils/functions/reduxActions";
import { addNewReplyOffline, deleteReplyOffline, addNewReply } from "../../actions/actionReplyComents";
import { getChildComment } from "../../actions/actionComments";
function* handleAddNewReply({ payload }) {
    const auth = yield select((state) => state.auth);
    const reply = {
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
        if (payload.body.id) {
            yield put(addNewReplyOffline(reply));
        }
        payload?.cb?.();
        const res = yield call(fetchAPI.request, {
            method: 'POST',
            url: payload.endpoint,
            data: { ...payload.body },
            params: {
                ...payload.params,
            },
        });
        yield put(deleteReplyOffline(reply.id));
        yield put(addNewReply.success({ status: res.data.status, data: res.data.data }));
        const newReply = yield select((state) => state.replyComments.data);
        const childComments = newReply.filter((_, index) => index < 3);
        const childCommentTotal = newReply.length;
        yield put(getChildComment({ childComments, childCommentTotal, parentID: payload.body.parentID }));
    }
    catch (err) {
        console.log(err);
        // yield put(deleteReplyOffline(reply.id));
        yield put(addNewReply.failure('Sorry your reply is not added'));
        yield put(addNewReplyOffline({ ...reply, approved: 'failure' }));
    }
}
function* watchAddNewReply() {
    yield takeLeading(getActionType(addNewReply.request), handleAddNewReply);
}
export default watchAddNewReply;

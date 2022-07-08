import { call, put, select, takeLeading } from 'redux-saga/effects';
import fetchAPI from "../../../../utils/functions/fetchAPI";
import { getActionType } from "../../../../utils/functions/reduxActions";
import { editComment } from '../../actions/actionComments';
function* handleEditComment({ payload }) {
    try {
        const res = yield call(fetchAPI.request, {
            method: 'POST',
            url: payload.endpoint,
            data: { ...payload.body },
        });
        yield put(editComment.success({ data: { comment: res.data.data.comment, id: payload.id } }));
        const newComments = yield select((state) => state.postComments);
        payload?.cb?.({ status: newComments.statusEdit, message: newComments.messageEdit });
    }
    catch (err) {
        console.log(err.response);
        yield put(editComment.failure('Your comment have not been updated'));
        const newComments = yield select((state) => state.postComments);
        payload?.cb?.({ status: newComments.statusEdit, message: newComments.messageEdit });
    }
}
function* watchEditComment() {
    yield takeLeading(getActionType(editComment.request), handleEditComment);
}
export default watchEditComment;

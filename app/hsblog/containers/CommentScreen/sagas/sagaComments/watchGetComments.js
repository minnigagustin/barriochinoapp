import fetchAPI from "../../../../utils/functions/fetchAPI";
import { call, put, takeLeading } from 'redux-saga/effects';
import { getActionType } from "../../../../utils/functions/reduxActions";
import { getPostComment } from '../../actions/actionComments';
function* handleGetComments({ payload }) {
    try {
        const res = yield call(fetchAPI.request, {
            url: payload.endpoint,
            params: payload.params,
        });
        yield put(getPostComment.success({
            status: res.data.status,
            data: res.data.data,
            pagination: res.data.pagination,
        }));
    }
    catch (err) {
        yield put(getPostComment.failure(err.message));
    }
}
function* watchGetComments() {
    yield takeLeading(getActionType(getPostComment.request), handleGetComments);
}
export default watchGetComments;

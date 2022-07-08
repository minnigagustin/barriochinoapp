import { put, call, takeEvery } from 'redux-saga/effects';
import { getPostDetail } from "../actions/actionPostDetail";
import fetchAPI from "../../../utils/functions/fetchAPI";
import { getActionType } from "../../../utils/functions/reduxActions";
function* handlePostDetail({ payload: endpoint }) {
    try {
        const res = yield call(fetchAPI.request, { url: endpoint });
        yield put(getPostDetail.success({ data: res.data, endpoint }));
    }
    catch {
        yield put(getPostDetail.failure({ message: 'Error', endpoint }));
    }
}
export default function* watchDetailContent() {
    yield takeEvery(getActionType(getPostDetail.request), handlePostDetail);
}

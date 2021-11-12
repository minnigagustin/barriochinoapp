import { takeLatest, put, call } from 'redux-saga/effects';
import { getTrending } from "../actions/actionSearch";
import fetchAPI from "../../../utils/functions/fetchAPI";
import { getActionType } from "../../../utils/functions/reduxActions";
function* handleTrendingRequest({ payload }) {
    try {
        const res = yield call(fetchAPI.request, { url: payload });
        yield put(getTrending.success(res.data.data));
    }
    catch {
        yield put(getTrending.failure('Error'));
    }
}
export default function* watchTrendingPosts() {
    yield takeLatest(getActionType(getTrending.request), handleTrendingRequest);
}

import { takeLatest, call, put, delay } from 'redux-saga/effects';
import { getActionType } from "../../../utils/functions/reduxActions";
import { searchChange } from "../actions/actionSearch";
import fetchAPI from "../../../utils/functions/fetchAPI";
import { PLUCK } from "../../../utils/constants/constants";
function* handleSeachChange({ payload }) {
    try {
        yield delay(200);
        const res = yield call(fetchAPI.request, {
            url: payload.endpoint,
            params: {
                q: payload.query,
                postType: 'post',
                pluck: PLUCK,
            },
        });
        yield put(searchChange.success(res.data.data));
    }
    catch {
        yield put(searchChange.failure('Error'));
    }
}
export default function* watchSearchChange() {
    yield takeLatest(getActionType(searchChange.request), handleSeachChange);
}

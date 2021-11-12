import fetchAPI from "../../../utils/functions/fetchAPI";
import { takeLatest, put, call } from 'redux-saga/effects';
import { getActionType } from "../../../utils/functions/reduxActions";
import { getFavorite } from '../actions/actionPostDetail';
function* handleGetFavorite({ payload }) {
    try {
        const res = yield call(fetchAPI.request, {
            url: payload.endpoint,
            params: {
                postID: payload.postID,
            },
        });
        yield put(getFavorite.success({
            isAdded: res.data.data.isMyFavorite,
            postEndpoint: payload.postEndpoint,
        }));
    }
    catch (err) {
        console.log(err.response);
        yield put(getFavorite.failure({
            message: 'Error',
            postEndpoint: payload.postEndpoint,
        }));
    }
}
export function* watchGetFavorite() {
    yield takeLatest(getActionType(getFavorite.request), handleGetFavorite);
}

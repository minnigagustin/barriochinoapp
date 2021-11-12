import fetchAPI from "../../../utils/functions/fetchAPI";
import { takeLeading, put, call } from 'redux-saga/effects';
import { getActionType } from "../../../utils/functions/reduxActions";
import { postFavorite } from '../actions/actionPostDetail';
function* handlePostFavorite({ payload }) {
    try {
        const res = yield call(fetchAPI.request, {
            method: 'POST',
            url: payload.endpoint,
            params: {
                postID: payload.postID,
            },
        });
        yield put(postFavorite.success({
            isAdded: res.data.isAdded,
            postEndpoint: payload.postEndpoint,
        }));
        payload.callback?.(res.data.isAdded);
    }
    catch (err) {
        console.log(err.response);
        yield put(postFavorite.failure({
            message: 'Error',
            postEndpoint: payload.postEndpoint,
        }));
    }
}
export function* watchPostFavorite() {
    yield takeLeading(getActionType(postFavorite.request), handlePostFavorite);
}

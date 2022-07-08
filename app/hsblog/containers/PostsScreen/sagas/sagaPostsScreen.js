import fetchAPI from "../../../utils/functions/fetchAPI";
import { getPostsWithParams } from "../actions/actionPosts";
import { PLUCK } from "../../../utils/constants/constants";
import { takeLeading, call, put } from 'redux-saga/effects';
import { getActionType } from "../../../utils/functions/reduxActions";
function* handlePostWithParams({ payload }) {
    try {
        const res = yield call(fetchAPI.request, {
            url: payload.endpoint,
            params: {
                ...payload.params,
                pluck: PLUCK,
            },
        });
        yield put(getPostsWithParams.success(res.data));
    }
    catch (err) {
        console.log(err.response);
        yield put(getPostsWithParams.failure('Error'));
    }
}
function* watchGetPostsWithParams() {
    yield takeLeading(getActionType(getPostsWithParams.request), handlePostWithParams);
}
const sagaPostsScreen = [watchGetPostsWithParams];
export default sagaPostsScreen;

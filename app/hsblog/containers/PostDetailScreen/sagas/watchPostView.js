import fetchAPI from "../../../utils/functions/fetchAPI";
import { take, fork, call, delay, put, cancel } from 'redux-saga/effects';
import { getActionType } from "../../../utils/functions/reduxActions";
import { postView } from '../actions/actionPostDetail';
const ONE_MINUTE = 60000;
function* handlePostView({ payload }) {
    try {
        yield delay(ONE_MINUTE);
        yield call(fetchAPI.request, {
            method: 'POST',
            url: `${payload.endpoint}/${payload.postID}`,
        });
        yield put(postView.success({ postEndpoint: payload.postEndpoint }));
    }
    catch {
        yield put(postView.failure(null));
    }
}
let postViewTask;
export function* watchPostView() {
    while (true) {
        const actionPostViewRequest = yield take(getActionType(postView.request));
        if (!!postViewTask) {
            yield cancel(postViewTask);
        }
        postViewTask = yield fork(handlePostView, actionPostViewRequest);
    }
}
export function* watchPostViewCancel() {
    while (true) {
        const actionPostViewCancel = yield take(getActionType(postView.cancel));
        if (actionPostViewCancel.type === '@postViewCancel' && !!postViewTask) {
            yield cancel(postViewTask);
        }
    }
}

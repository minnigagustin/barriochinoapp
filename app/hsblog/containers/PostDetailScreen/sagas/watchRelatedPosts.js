import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { getActionType } from "../../../utils/functions/reduxActions";
import { getRelatedPosts } from "../actions/actionPostDetail";
import fetchAPI from "../../../utils/functions/fetchAPI";
import { PLUCK } from "../../../utils/constants/constants";
function* handleRelatedPosts({ payload }) {
    try {
        const res = yield call(fetchAPI.request, {
            url: `post/${payload.endpoint}/related-posts`,
            params: {
                postType: 'post',
                numberOfPosts: 6,
                pluck: PLUCK,
            },
        });
        yield put(getRelatedPosts.success({ data: res.data, endpoint: payload.endpoint }));
    }
    catch (err) {
        yield put(getRelatedPosts.failure({ message: 'Error', endpoint: payload.endpoint }));
    }
}
let relatedPostsTask;
export function* watchRelatedPosts() {
    while (true) {
        const actionGetRelatedPostsRequest = yield take(getActionType(getRelatedPosts.request));
        if (!!relatedPostsTask) {
            yield cancel(relatedPostsTask);
        }
        relatedPostsTask = yield fork(handleRelatedPosts, actionGetRelatedPostsRequest);
    }
}
export function* watchRelatedPostsCancel() {
    while (true) {
        const actionGetRelatedPostsCancel = yield take(getActionType(getRelatedPosts.cancel));
        if (actionGetRelatedPostsCancel.type === '@getRelatedPostsCancel' && !!relatedPostsTask) {
            yield cancel(relatedPostsTask);
        }
    }
}

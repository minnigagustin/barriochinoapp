import { takeLatest, put, call, takeEvery, takeLeading, retry, delay } from 'redux-saga/effects';
import { getActionType } from '../getActionType';
function getSagaEffect(sagaEffect) {
    switch (sagaEffect) {
        case 'takeEvery':
            return takeEvery;
        case 'takeLeading':
            return takeLeading;
        case 'takeLatest':
        default:
            return takeLatest;
    }
}
export function watchAsyncAction({ sagaEffect, asyncAction, success, failure, axiosConfig, fetch, useRetry = false, retryMaxTries = 3, retryDelay = 5000, requestDelay = 0, }) {
    const effect = getSagaEffect(sagaEffect);
    return function* () {
        yield effect(getActionType(asyncAction.request), function* ({ payload }) {
            try {
                if (!!requestDelay) {
                    yield delay(requestDelay);
                }
                const res = yield useRetry
                    ? retry(retryMaxTries, retryDelay, fetch, axiosConfig(payload))
                    : call(fetch, axiosConfig(payload));
                yield put(asyncAction.success(success(res, payload)));
            }
            catch (error) {
                yield put(asyncAction.failure(failure(error, payload)));
            }
        });
    };
}

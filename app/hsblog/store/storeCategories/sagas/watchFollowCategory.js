import fetchAPI from "../../../utils/functions/fetchAPI";
import { takeLatest, put, call } from 'redux-saga/effects';
import { getActionType } from "../../../utils/functions/reduxActions";
import { followCategory } from '../actions/actionFollowCategory';
function* handleFollowCategory({ payload }) {
    try {
        yield call(fetchAPI.request, {
            method: 'POST',
            url: payload.endpoint,
            data: {
                categories: payload.categories,
            },
        });
        yield put(followCategory.success(undefined));
    }
    catch (err) {
        console.log(err);
        yield put(followCategory.failure(undefined));
    }
}
export default function* watchFollowCategory() {
    yield takeLatest(getActionType(followCategory.request), handleFollowCategory);
}

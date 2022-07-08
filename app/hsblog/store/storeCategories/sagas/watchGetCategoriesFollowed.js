import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getActionType } from "../../../utils/functions/reduxActions";
import fetchAPI from "../../../utils/functions/fetchAPI";
import { categoriesSelectedIdsSelector } from "../../selectors";
import { getCategoriesFollowed } from '../actions/actionFollowCategory';
function* handleGetCategoriesFollowed({ payload }) {
    try {
        const res = yield call(fetchAPI.request, {
            url: payload.endpoint,
        });
        yield put(getCategoriesFollowed.success({ data: res.data.data }));
        const categoriesSelectedIds = yield select(categoriesSelectedIdsSelector);
        payload.callback?.(categoriesSelectedIds);
    }
    catch (err) {
        console.log(err.response);
        yield put(getCategoriesFollowed.failure({ message: 'Error' }));
    }
}
export default function* watchGetCategoriesFollowed() {
    yield takeLatest(getActionType(getCategoriesFollowed.request), handleGetCategoriesFollowed);
}

import { getCategories } from "../actions/actionCategories";
import fetchAPI from "../../../utils/functions/fetchAPI";
import { takeLatest, put, call } from 'redux-saga/effects';
import { getActionType } from "../../../utils/functions/reduxActions";
import watchGetCategoriesFollowed from './watchGetCategoriesFollowed';
import watchFollowCategory from './watchFollowCategory';
function* handleGetCategories({ payload }) {
    try {
        const res = yield call(fetchAPI.request, { url: payload.endpoint, params: payload.params });
        yield put(getCategories.success(res.data));
    }
    catch {
        yield put(getCategories.failure('Error'));
    }
}
export function* watchGetCategories() {
    yield takeLatest(getActionType(getCategories.request), handleGetCategories);
}
const sagaCategories = [watchGetCategories, watchGetCategoriesFollowed, watchFollowCategory];
export default sagaCategories;

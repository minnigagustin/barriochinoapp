import { takeLatest, put } from 'redux-saga/effects';
import { searchScreenMounted } from "../actions/actionSearch";
import { getTrending } from "../actions/actionSearch";
import { getActionType } from "../../../utils/functions/reduxActions";
import { getCategories } from "../../../store/storeCategories/actions/actionCategories";
function* handleSearch() {
    yield put(getTrending.request('articles?postType=post&numberOfPosts=6&orderby=popular_views'));
    yield put(getCategories.request({ endpoint: 'category', params: { number: 0 } }));
}
export default function* watchSearchMounted() {
    yield takeLatest(getActionType(searchScreenMounted), handleSearch);
}

import { all, delay, call, spawn } from 'redux-saga/effects';
import sagaPostDetailScreen from "../containers/PostDetailScreen/sagas/sagaPostDetailScreen";
import sagaSearchScreen from "../containers/SearchScreen/sagas/sagaSearchScreen";
import sagaPostsScreen from "../containers/PostsScreen/sagas/sagaPostsScreen";
import sagaTabPostsScreen from "../containers/TabPostsScreen/sagas/sagaPostsScreen";
import { sagaComments, sagaReply } from "../containers/CommentScreen/sagas";
import sagaCategories from './storeCategories/sagas/sagaCategories';
const sagas = [
    ...sagaSearchScreen,
    ...sagaPostDetailScreen,
    ...sagaComments,
    ...sagaReply,
    ...sagaPostsScreen,
    ...sagaTabPostsScreen,
    ...sagaCategories,
];
// https://github.com/redux-saga/redux-saga/issues/760#issuecomment-273737022
const makeRestartable = (saga) => {
    return function* () {
        yield spawn(function* () {
            while (true) {
                try {
                    yield call(saga);
                    console.error('unexpected root saga termination. The root sagas are supposed to be sagas that live during the whole app lifetime!', saga);
                }
                catch (e) {
                    console.error('Saga error, the saga will be restarted', e);
                }
                yield delay(1000); // Avoid infinite failures blocking app TODO use backoff retry policy...
            }
        });
    };
};
const rootSagas = sagas.map(makeRestartable);
export default function* root() {
    yield all(rootSagas.map(call));
}

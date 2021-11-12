import { createReducer } from "../../../utils/functions/reduxActions";
import handleAsyncActionCustom from "../../../utils/functions/handleAsyncActionCustom";
const initialState = {
    data: {
        data: [],
    },
    pageNext: 1,
};
export const postsWithParams = createReducer(initialState, handleAsyncActionCustom(['@getTabPostsWithParamsRequest', '@getTabPostsWithParamsSuccess', '@getTabPostsWithParamsFailure']));

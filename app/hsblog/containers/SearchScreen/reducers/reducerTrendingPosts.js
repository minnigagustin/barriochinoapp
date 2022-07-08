import { createReducer } from "../../../utils/functions/reduxActions";
import { handleAsyncAction } from "../../../utils/functions/reduxActions/helpers";
const initialState = {
    status: 'loading',
    data: [],
    message: '',
};
export const trendingPosts = createReducer(initialState, handleAsyncAction(['@getTrendingRequest', '@getTrendingSuccess', '@getTrendingFailure']));

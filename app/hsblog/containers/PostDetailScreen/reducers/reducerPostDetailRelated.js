import { createReducer, handleAction } from "../../../utils/functions/reduxActions";
import getPostDetailMax50 from "../../../utils/functions/getPostDetailMax50";
const initialState = {};
export const postDetailRelatedPosts = createReducer(initialState, [
    handleAction('@getRelatedPostsRequest', (state, action) => {
        state[action.payload.endpoint] = {
            ...state[action.payload.endpoint],
            status: 'loading',
        };
        return state;
    }),
    handleAction('@getRelatedPostsSuccess', (state, action) => {
        state[action.payload.endpoint].status = 'success';
        state[action.payload.endpoint].data = action.payload.data;
        return getPostDetailMax50(state);
    }),
    handleAction('@getRelatedPostsFailure', (state, action) => {
        state[action.payload.endpoint].status = 'failure';
        state[action.payload.endpoint].message = action.payload.message;
        return state;
    }),
]);

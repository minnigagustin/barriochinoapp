import { createReducer, handleAction } from "../../../utils/functions/reduxActions";
const initialState = {
    data: [],
};
export const categoriesSelected = createReducer(initialState, [
    handleAction('@selectCategory', (state, action) => ({
        ...state,
        status: 'success',
        data: action.payload.categories,
    })),
    handleAction('@getCategoriesFollowedRequest', state => ({
        ...state,
        status: 'loading',
    })),
    handleAction('@getCategoriesFollowedSuccess', (state, action) => ({
        ...state,
        status: 'success',
        data: action.payload.data,
    })),
    handleAction('@getCategoriesFollowedFailure', (state, action) => ({
        ...state,
        status: 'failure',
        message: action.payload.message,
    })),
]);

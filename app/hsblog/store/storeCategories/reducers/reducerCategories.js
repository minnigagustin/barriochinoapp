import { createReducer } from "../../../utils/functions/reduxActions";
import { handleAsyncAction } from "../../../utils/functions/reduxActions/helpers";
const initialState = {
    data: {
        status: '',
        data: [],
    },
};
export const categories = createReducer(initialState, handleAsyncAction(['@getCategoriesRequest', '@getCagegoriesSuccess', '@getCategoriesFailure']));

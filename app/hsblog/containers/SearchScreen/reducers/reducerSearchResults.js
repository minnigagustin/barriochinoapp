import { createReducer } from "../../../utils/functions/reduxActions";
import { handleAsyncAction } from "../../../utils/functions/reduxActions/helpers";
const initialState = {
    data: [],
};
export const searchResult = createReducer(initialState, handleAsyncAction(['@searchChangeRequest', '@searchChangeSuccess', '@searchChangeFailure']));

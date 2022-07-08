import { createReducer, handleAction } from "../../../utils/functions/reduxActions";
const initialState = 'small';
export const postTextSize = createReducer(initialState, [
    handleAction('@changePostTextSize', (_state, action) => action.payload.size),
]);

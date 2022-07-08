import { createReducer, handleAction } from "../../../utils/functions/reduxActions";
export const postDetailTutorial = createReducer(true, [
    handleAction('@changePostDetailTutorial', state => !state),
]);

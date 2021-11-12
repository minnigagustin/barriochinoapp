import { createAsyncAction, createDispatchAction } from "../../../utils/functions/reduxActions";
export const getPostsWithParams = createAsyncAction([
    '@getTabPostsWithParamsRequest',
    '@getTabPostsWithParamsSuccess',
    '@getTabPostsWithParamsFailure',
])();
export const useGetPostsWithParamsRequest = createDispatchAction(getPostsWithParams.request);

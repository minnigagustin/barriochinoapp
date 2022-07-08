import { createAsyncAction, createDispatchAction } from "../../../utils/functions/reduxActions";
export const getPostsWithParams = createAsyncAction(['@getPostsWithParamsRequest', '@getPostsWithParamsSuccess', '@getPostsWithParamsFailure'])();
export const useGetPostsWithParamsRequest = createDispatchAction(getPostsWithParams.request);

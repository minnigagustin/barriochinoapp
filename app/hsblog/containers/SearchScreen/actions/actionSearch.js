import { createAction, createAsyncAction, createDispatchAction } from "../../../utils/functions/reduxActions";
export const searchScreenMounted = createAction('@searchScreenMounted');
export const getTrending = createAsyncAction(['@getTrendingRequest', '@getTrendingSuccess', '@getTrendingFailure'])();
export const searchChange = createAsyncAction(['@searchChangeRequest', '@searchChangeSuccess', '@searchChangeFailure'])();
export const useSearchScreenMounted = createDispatchAction(searchScreenMounted);
export const useSearchChangeRequest = createDispatchAction(searchChange.request);

import { createAsyncAction, createDispatchAction } from "../../../utils/functions/reduxActions";
export const getCategories = createAsyncAction(['@getCategoriesRequest', '@getCagegoriesSuccess', '@getCategoriesFailure'])();
export const useGetCategoriesRequest = createDispatchAction(getCategories.request);

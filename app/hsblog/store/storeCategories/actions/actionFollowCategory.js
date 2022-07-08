import { createAsyncAction, createDispatchAction, createDispatchAsyncAction } from "../../../utils/functions/reduxActions";
export const getCategoriesFollowed = createAsyncAction([
    '@getCategoriesFollowedRequest',
    '@getCategoriesFollowedSuccess',
    '@getCategoriesFollowedFailure',
])();
export const followCategory = createAsyncAction(['@followCategoryRequest', '@followCategorySuccess', '@followCategoryFailure'])();
export const useGetCategoriesFollowed = createDispatchAsyncAction(getCategoriesFollowed);
export const useFollowCategoryRequest = createDispatchAction(followCategory.request);

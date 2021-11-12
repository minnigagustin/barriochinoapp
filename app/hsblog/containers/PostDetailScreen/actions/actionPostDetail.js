import { createAsyncAction, createAction, createDispatchAction, createDispatchAsyncAction } from "../../../utils/functions/reduxActions";
export const postDetailAction = {
    mounted: createAction('@postDetailMounted', (endpoint, postEndpoint, postID) => ({
        endpoint,
        postEndpoint,
        postID,
    })),
};
export const getPostDetail = createAsyncAction(['@getPostDetailRequest', '@getPostDetailSuccess', '@getPostDetailFailure'])();
export const getRelatedPosts = createAsyncAction([
    '@getRelatedPostsRequest',
    '@getRelatedPostsSuccess',
    '@getRelatedPostsFailure',
    '@getRelatedPostsCancel',
])();
export const getFavorite = createAsyncAction(['@getFavoriteRequest', '@getFavoriteSuccess', '@getFavoriteFailure'])();
export const postFavorite = createAsyncAction(['@postFavoriteRequest', '@postFavoriteSuccess', '@postFavoriteFailure'])();
export const postView = createAsyncAction(['@postViewRequest', '@postViewSuccess', '@postViewFailure', '@postViewCancel'])();
export const changePostTextSize = createAction('@changePostTextSize', (size) => ({ size }));
export const changePostDetailTutorial = createAction('@changePostDetailTutorial');
export const usePostDetailMounted = createDispatchAction(postDetailAction.mounted);
export const useChangePostTextSize = createDispatchAction(changePostTextSize);
export const usePostFavorite = createDispatchAsyncAction(postFavorite);
export const useGetFavorite = createDispatchAsyncAction(getFavorite);
export const usePostView = createDispatchAsyncAction(postView);
export const useGetRelatedPosts = createDispatchAsyncAction(getRelatedPosts);
export const useGetPostDetailRequest = createDispatchAction(getPostDetail.request);
export const useChangePostDetailTutorial = createDispatchAction(changePostDetailTutorial);

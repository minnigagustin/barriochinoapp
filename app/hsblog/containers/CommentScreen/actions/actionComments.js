import { createAsyncAction, createDispatchAction, createAction } from "../../../utils/functions/reduxActions";
export const getPostComment = createAsyncAction(['@getPostCommentsRequest', '@getPostCommentsSuccess', '@getPostCommentsFailure'])();
export const postNewComment = createAsyncAction(['@postNewCommentRequest', '@postNewCommentSuccess', '@postNewCommentFailure'])();
export const postNewCommentOffline = createAction('@postNewCommentOffline', (payload) => ({
    comment: payload,
}));
export const deleteComment = createAsyncAction(['@deleteCommentRequest', '@deleteCommentSuccess', '@deleteCommentFailure'])();
export const deleteCommentOffline = createAction('@deleteCommentOffline', (payload) => ({
    id: payload,
}));
export const editComment = createAsyncAction(['@editCommentRequest', '@editCommentSuccess', '@editCommentFailure'])();
export const getChildComment = createAction('@getChildComment', (payload) => ({
    data: payload,
}));
export const useGetPostComment = createDispatchAction(getPostComment.request);
export const useDeleteComment = createDispatchAction(deleteComment.request);
export const useAddNewComment = createDispatchAction(postNewComment.request);
export const useDeleteOffline = createDispatchAction(deleteCommentOffline);
export const useEditComment = createDispatchAction(editComment.request);

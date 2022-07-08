import { createAsyncAction, createDispatchAction, createAction } from "../../../utils/functions/reduxActions";
export const getReplyComments = createAsyncAction(['@getReplyRequest', '@getReplySuccess', '@getReplyFailure'])();
export const addNewReply = createAsyncAction(['@addNewReplyRequest', '@addNewReplySuccess', '@addNewReplyFailure'])();
export const addNewReplyOffline = createAction('@addNewReplyOffline', (payload) => ({
    comment: payload,
}));
export const deleteReplyOffline = createAction('@deleteReplyOffline', (payload) => ({
    id: payload,
}));
export const deleteReply = createAsyncAction(['@deleteReplyRequest', '@deleteReplySuccess', '@deleteReplyFailure'])();
export const editReply = createAsyncAction(['@editReplyRequest', '@editReplySuccess', '@editReplyFailure'])();
export const useGetReply = createDispatchAction(getReplyComments.request);
export const useAddNewReply = createDispatchAction(addNewReply.request);
export const useDeleteReplyOffline = createDispatchAction(deleteReplyOffline);
export const useDeleteReply = createDispatchAction(deleteReply.request);
export const useEditReply = createDispatchAction(editReply.request);

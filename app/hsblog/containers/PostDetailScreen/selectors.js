import { createSelector } from 'reselect';
import { isEmpty } from 'ramda';
export const postDetailsSelector = (state) => state.postDetails;
export const postDetailRelatedPostsSelector = (state) => state.postDetailRelatedPosts;
export const postTextSizeSelector = (state) => state.postTextSize;
export const historyPostsSelector = createSelector(postDetailsSelector, postDetails => {
    return (isEmpty(postDetails) ? [] : Object.values(postDetails).map(detail => detail?.data || {}));
});
export const postDetailTutorialSelector = (state) => state.postDetailTutorial;

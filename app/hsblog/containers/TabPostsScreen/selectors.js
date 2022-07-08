export const tabPostsWithParamsSelector = (state) => state.tabPostsWithParams;
export const pageSelector = (state) => tabPostsWithParamsSelector(state).data?.pagination?.next?.params?.page;
export const maxNumPagesSelector = (state) => tabPostsWithParamsSelector(state).data.pagination?.maxNumPages;

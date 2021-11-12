export const postsWithParamsSelector = (state) => state.postsWithParams;
export const pageSelector = (state) => postsWithParamsSelector(state).data?.pagination?.next?.params?.page;
export const maxNumPagesSelector = (state) => postsWithParamsSelector(state).data.pagination?.maxNumPages;

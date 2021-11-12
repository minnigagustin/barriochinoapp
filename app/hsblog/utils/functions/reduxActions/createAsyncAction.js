import { createAction } from './createAction';
/**
 * @description Redux create async action
 * @param types action types [request, success, failure, ?cancel]
 * @example
 * ```typescript
 *  const getArticles = createAsyncAction(['getArticlesRequest', 'getArticlesSuccess', 'getArticlesFailure', 'getArticlesCancel'])<string, Articles, string>();
 * ```
 */
export function createAsyncAction(types) {
    return () => {
        return {
            request: createAction(types[0], (payload) => payload),
            success: createAction(types[1], (payload) => payload),
            failure: createAction(types[2], (payload) => payload),
            ...(!!types[3] ? { cancel: createAction(types[3], (payload) => payload) } : {}),
        };
    };
}

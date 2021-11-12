import { Dispatcher } from './dispatcher';
/**
 * Redux createDispatchAsyncAction
 * @param action redux async action
 * @example
 * ```typescript
 * export const getPost = createAsyncAction(['GET_POST_REQUEST', 'GET_POST_SUCCESS', 'GET_POST_FAILURE'])<string, Data, string>();
 * export const useGetPost = createDispatchAsyncAction(getPost);
 *
 * // Use in component
 * const getPost = useGetPost();
 * useMount(() => getPost.request('posts/:id'));
 * ```
 */
export function createDispatchAsyncAction(asyncAction) {
    return () => {
        return {
            request: Dispatcher(asyncAction.request),
            success: Dispatcher(asyncAction.success),
            failure: Dispatcher(asyncAction.failure),
            ...(!!asyncAction.cancel ? { cancel: Dispatcher(asyncAction.cancel) } : {}),
        };
    };
}

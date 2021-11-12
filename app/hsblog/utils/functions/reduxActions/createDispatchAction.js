import { Dispatcher } from './dispatcher';
/**
 * Redux createDispatchAction
 * @param action redux action
 * @example
 * ```typescript
 * export const getPost = createAction('GET_POST', (endpoint: string) => ({ endpoint }));
 * export const useGetPost = createDispatchAction(getPost);
 *
 * // Use in component
 * const getPost = useGetPost();
 * useMount(() => getPost('posts/:id'));
 * ```
 */
export function createDispatchAction(action) {
    return () => Dispatcher(action);
}

import { COMMA } from './constants';
/**
 * @description array `handleAction` function -> object with `key = handleAction type` and `value = handleAction callback`
 * @param handleActions array `handleAction` function
 * @example
 * ```typescript
 * const handleActions = [
 *  handleAction('foo', (state, action) => ({
 *    ...state,
 *    ...
 *  })),
 *  handleAction('bar', (state, action) => ({
 *    ...state,
 *    ...
 *  }))
 * ];
 * const obj = getObjectFromHandleActions(handleActions);
 * ```
 * @result
 * ```typescript
 * {
 *  foo: (state, action) => ({
 *    ...state,
 *    ...
 *  }),
 *  bar: (state, action) => ({
 *    ...state,
 *    ...
 *  })
 * }
 * ```
 */
export function getObjectFromHandleActions(handleActions) {
    return handleActions.reduce((acc, handleAction) => {
        const [key] = Object.keys(handleAction);
        const [callback] = Object.values(handleAction);
        // check not multiple type handleAction
        if (!key.includes(COMMA)) {
            return {
                ...acc,
                [key]: callback,
            };
        }
        return {
            ...acc,
            ...key.split(COMMA).reduce((acc, key) => ({
                ...acc,
                [key]: callback,
            }), {}),
        };
    }, {});
}

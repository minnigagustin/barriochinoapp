/**
 * @description Redux handle action
 * @param type action type
 * @param callback
 * @example
 * ```typescript
 * const reducer = createReducer<ExampleState, ExampleAction>(initialState, [
 *  handleAction('type', (state, action) => ({
 *    ...state,
 *    ...
 *  })),
 *  ...
 * ])
 * ```
 * ```
 */
export function handleAction(type, callback) {
    return {
        [type]: callback,
    };
}

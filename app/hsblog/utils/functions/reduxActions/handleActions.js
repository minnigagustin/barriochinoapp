import { COMMA } from './constants';
/**
 * @description Redux handle multiple action
 * @param types multiple action type `[type1, type2, ...]`
 * @param callback
 * @example
 * ```typescript
 * const reducer = createReducer<ExampleState, ExampleAction>(initialState, [
 *  handleActions(['type_1', 'type_2'], (state, action) => ({
 *    ...state,
 *    ...
 *  })),
 *  ...
 * ])
 * ```
 * ```
 */
export function handleActions(types, callback) {
    return {
        [types.join(COMMA)]: callback,
    };
}

import { getObjectFromHandleActions } from './getObjectFromHandleActions';
import { immutableState } from './immutableState';
/**
 * @description Redux create reducer
 * @param initialState Reducer state
 * @param handleActions handle action array
 * @example
 * ```typescript
 * import getExampleAction from 'getExampleAction';
 *
 * type ExampleAction = ReturnType<typeof getExampleAction>
 *
 * interface ExampleState = {
 *  id: string;
 *  title: string;
 * }
 *
 * const initialState = {
 *  id: 'example',
 *  title: 'example title',
 * }
 *
 * // using with handleAction and handleActions
 * const reducer = createReducer<ExampleState, ExampleAction>(initialState, [
 *  handleAction('type', (state, action) => ({
 *    ...state,
 *    ...
 *  })),
 *  handleActions(['type_1', 'type_2'], (state, action) => ({
 *    ...state,
 *    ...
 *  }))
 * ])
 *
 * // using with object action
 * const reducer = createReducer<ExampleState, ExampleAction>(initialState, {
 *  type: (state, action) => ({
 *    ...state,
 *    ...
 *  }),
 *  type_2: (state, action) => ({
 *    ...state,
 *    ...
 *  })
 * })
 * ```
 */
export function createReducer(initialState, handleActions) {
    const objectActions = Array.isArray(handleActions) ? getObjectFromHandleActions(handleActions) : handleActions;
    return (state = initialState, action) => {
        const { type } = action;
        const callback = objectActions[type];
        return typeof callback === 'function' ? callback(immutableState(state), action) : state;
    };
}

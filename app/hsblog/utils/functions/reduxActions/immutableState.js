/**
 * Redux immutable state
 * @param state Reducer state
 * @example
 * ```typescript
 * const state = [1, 2, 3];
 * const newState = immutableState(state);
 * ```
 */
export function immutableState(state) {
    if (Array.isArray(state)) {
        return [...state];
    }
    if (!!state && typeof state === 'object') {
        return Object.assign({}, state);
    }
    return state;
}

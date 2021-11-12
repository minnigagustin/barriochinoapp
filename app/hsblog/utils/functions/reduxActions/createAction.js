/**
 * @description Redux create action
 * @param type Action type
 * @param callback input `payload`
 * @example
 * ```typescript
 * const getExampleAction = createAction('type', (endpoint: string, params: ExampleParams) => ({
 *  endpoint,
 *  params
 * }));
 *
 * const getExampleEmpty = createAction('type2');
 * ```
 * @result
 * ```typescript
 *  {
 *    type: 'type',
 *    payload: {
 *      endpoint: string,
 *      params: ExampleParams
 *    }
 * }
 * ```
 */
export function createAction(type, callback) {
    return (...payload) => {
        if (typeof callback !== 'function' || payload.length === 0) {
            return {
                type,
            };
        }
        return {
            type,
            payload: callback(...payload),
        };
    };
}

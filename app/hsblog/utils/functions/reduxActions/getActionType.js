/**
 * Get action type
 * @param createAction redux action
 * @example
 * ```typescript
 * export const getArticle = createAction('GET_ARTICLE', (endpoint: string) => ({
 *  endpoint,
 * }));
 * const articleType = getActionType(getArticle);
 * ```
 * @result
 * ```typescript
 * articleType = 'GET_ARTICLE'
 * ```
 */
export function getActionType(reduxAction) {
    return reduxAction().type;
}

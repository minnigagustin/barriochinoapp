import { createSelector } from 'reselect';
export const categoriesSelector = (state) => state.categories;
export const categoriesSelectedSelector = (state) => state.categoriesSelected;
export const categoriesSelectedIdsSelector = createSelector(categoriesSelectedSelector, categoriesSelected => categoriesSelected.data.map(item => item.id));

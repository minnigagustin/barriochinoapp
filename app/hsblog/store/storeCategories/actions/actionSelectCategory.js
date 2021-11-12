import { createAction, createDispatchAction } from "../../../utils/functions/reduxActions";
export const selectCategory = createAction('@selectCategory', (categories) => ({ categories }));
export const useSelectCategory = createDispatchAction(selectCategory);

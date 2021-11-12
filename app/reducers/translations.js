import { GET_TRANSLATIONS } from "../constants/actionTypes";
import translationDefault from "../utils/translationDefault";
import { decodeObject } from "../utils/decodeObject";

export const translations = (state = translationDefault, action) => {
  switch (action.type) {
    case GET_TRANSLATIONS:
      return { ...translationDefault, ...action.payload };
    default:
      return state;
  }
};

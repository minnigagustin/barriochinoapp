import isIOS from "../../shared/utils/isIOS";
export const fontWeightTitle = isIOS ? { fontWeight: '500' } : { fontFamily: 'sans-serif-medium', fontWeight: 'normal' };
export const fontWeightText = isIOS ? { fontWeight: '400' } : { fontFamily: 'sans-serif', fontWeight: 'normal' };

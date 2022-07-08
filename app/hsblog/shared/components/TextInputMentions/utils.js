import { groupWith, pipe, map, type } from 'ramda';
import isIOS from "../../utils/isIOS";
export function checkInRange(source, from, to) {
    return source > from && source < to;
}
export function toAlphabetLowerCase(souce) {
    return souce
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, m => (m === 'đ' ? 'd' : 'D'))
        .toLowerCase();
}
export function getInputFakePaddingVerticalValue(value) {
    const checkTextMultipeLine = /\n/g.test(value);
    const forIos = 7;
    const forAndroid = checkTextMultipeLine ? 5 : 10;
    return isIOS ? forIos : forAndroid;
}
export function joinStringInArray(source) {
    return pipe(groupWith((x, y) => type(x) === 'String' && type(y) === 'String'), map(item => (item.length === 1 ? item[0] : item.join(''))))(source);
}

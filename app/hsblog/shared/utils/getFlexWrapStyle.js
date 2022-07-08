import { tachyonsStyles as tachyons } from "../themes/tachyons";
export default function getFlexWrapStyle(flexWrap) {
    switch (flexWrap) {
        case 'nowrap':
            return tachyons.flexNowrap;
        case 'wrap-reverse':
            return tachyons.flexWrapReverse;
        case 'wrap':
            return tachyons.flexWrap;
        default:
            return tachyons.empty;
    }
}

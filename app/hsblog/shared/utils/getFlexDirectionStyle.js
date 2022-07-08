import { tachyonsStyles as tachyons } from "../themes/tachyons";
export default function getFlexDirectionStyle(flexDirection) {
    switch (flexDirection) {
        case 'column':
            return tachyons.flexColumn;
        case 'column-reverse':
            return tachyons.flexColumnReverse;
        case 'row':
            return [tachyons.flexRow, tachyons.flexWrap];
        case 'row-reverse':
            return tachyons.flexRowReverse;
        default:
            return tachyons.empty;
    }
}

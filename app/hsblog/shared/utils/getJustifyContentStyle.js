import { tachyonsStyles as tachyons } from "../themes/tachyons";
export default function getJustifyContentStyle(justifyContent) {
    switch (justifyContent) {
        case 'flex-start':
            return tachyons.justifyStart;
        case 'flex-end':
            return tachyons.justifyEnd;
        case 'center':
            return tachyons.justifyCenter;
        case 'space-around':
            return tachyons.justifyAround;
        case 'space-between':
            return tachyons.justifyBetween;
        case 'space-evenly':
            return tachyons.justifyEvenly;
        default:
            return tachyons.empty;
    }
}

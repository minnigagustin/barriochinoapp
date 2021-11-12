import { tachyonsStyles as tachyons } from "../themes/tachyons";
export default function getFlexStyle(flex) {
    if (typeof flex === 'boolean') {
        return flex ? tachyons.flex : {};
    }
    if (typeof flex === 'number') {
        return { flex };
    }
    return {};
}

import { tachyonsStyles } from "../themes/tachyons";
export const getTachyonsStyle = (tachyons) => {
    return typeof tachyons === 'string' ? tachyonsStyles[tachyons] : tachyons.map(style => tachyonsStyles[style]);
};

import { tailwindStyles } from "../themes/tailwind";
export const getTailwindStyle = (tailwind) => {
    return typeof tailwind === 'string' ? tailwindStyles[tailwind] : tailwind.map(style => tailwindStyles[style]);
};

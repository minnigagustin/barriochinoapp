import { useEffect, useRef } from 'react';
export default function isFunction(fn) {
    return fn && typeof fn === 'function';
}
export const usePrevious = (state) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = state;
    });
    return ref.current;
};

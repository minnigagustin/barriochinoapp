import { useRef } from 'react';
import { useMount } from "./useMount";
export const useUnmount = (fn) => {
    const fnRef = useRef(fn);
    // update the ref each render so if it change the newest callback will be invoked
    fnRef.current = fn;
    useMount(() => () => fnRef.current());
};

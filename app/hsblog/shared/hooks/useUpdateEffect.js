import { useEffect } from 'react';
import { useFirstMountState } from './useFirstMountState';
const useUpdateEffect = (effect, deps) => {
    const isFirstMount = useFirstMountState();
    useEffect(() => {
        if (!isFirstMount) {
            return effect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};
export default useUpdateEffect;

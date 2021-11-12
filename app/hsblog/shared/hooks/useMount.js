import { useEffect } from 'react';
export function useMount(effect) {
    useEffect(effect, []);
}

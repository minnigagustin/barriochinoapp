import { useState } from 'react';
export function useToggle(initialState) {
    const [state, setState] = useState(initialState);
    const onToggle = async () => {
        const nextState = !state;
        setState(nextState);
        return new Promise((resolve) => {
            resolve(nextState);
        });
    };
    return [state, onToggle];
}

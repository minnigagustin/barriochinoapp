import { useState, useCallback, useEffect } from 'react';
const initialMeasure = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    pageX: 0,
    pageY: 0,
};
let _req = 0;
export function useMeasure(ref) {
    const [measure, setMeasure] = useState(initialMeasure);
    const onMeasure = useCallback(() => {
        _req = requestAnimationFrame(() => {
            !!ref.current &&
                ref.current.measure((x, y, width, height, pageX, pageY) => {
                    setMeasure({ x, y, width, height, pageX, pageY });
                });
        });
    }, [ref]);
    useEffect(() => {
        return () => {
            !!_req && cancelAnimationFrame(_req);
        };
    }, []);
    return [measure, onMeasure];
}

import { useState, useCallback, useEffect, useRef } from 'react';
import { includes, equals } from 'ramda';
export function useSelectList({ inputResult = [], multiple = false, onResultCallback = () => { } }) {
    const [outputResult, setResult] = useState([]);
    const inputResultPrevRef = useRef([]);
    const onResultCallbackRef = useRef(onResultCallback);
    const setInputResult = useCallback(() => {
        // giá trị default nếu không phải dạng multiple thì chỉ có 1 phần tử đầu tiên
        if (!equals(inputResultPrevRef.current, inputResult)) {
            const nextOutputResult = multiple ? inputResult : [inputResult[0]];
            setResult(nextOutputResult);
            onResultCallbackRef.current?.(nextOutputResult);
        }
        inputResultPrevRef.current = inputResult;
    }, [inputResult, multiple]);
    useEffect(() => {
        setInputResult();
    }, [setInputResult]);
    const onSelect = useCallback((item) => {
        const removeItem = outputResult.filter(_item => !equals(_item, item));
        const addItem = multiple ? [...outputResult, item] : [item];
        const nextOutputResult = includes(item, outputResult) ? removeItem : addItem;
        setResult(nextOutputResult);
        onResultCallback?.(nextOutputResult);
    }, [outputResult, multiple, onResultCallback]);
    const isSelected = (item) => includes(item, outputResult);
    const getNumberSelected = (item) => outputResult.findIndex(_item => equals(_item, item)) + 1;
    return { outputResult, isSelected, getNumberSelected, onSelect, onPrevious: setInputResult };
}

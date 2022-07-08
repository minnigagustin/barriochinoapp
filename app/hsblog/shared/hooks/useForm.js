import { useState, useRef } from 'react';
function getError(field, value) {
    let error = '';
    if (typeof value !== 'string' && !Array.isArray(value)) {
        return '';
    }
    if (field.required) {
        error = value ? '' : 'required';
    }
    if (field.minLength) {
        error = (field.required && !value) || value.length >= field.minLength ? error : 'minLength';
    }
    if (field.maxLength) {
        error = value.length <= field.maxLength ? error : 'maxLength';
    }
    if (field.pattern) {
        error =
            (field.required && !value) || value.length < (field.minLength || 0) || value.length > (field.maxLength || Infinity) || field.pattern.test(value)
                ? error
                : 'pattern';
    }
    return error;
}
export function useForm() {
    const [result, setResult] = useState({});
    const [errors, setErrors] = useState({});
    const resultRef = useRef({});
    const errorsRef = useRef({});
    const getNewResult = (result) => (Object.values(result).length ? result : resultRef.current);
    const getNewErrors = (errors) => (Object.values(errors).length ? errors : errorsRef.current);
    const onChange = (field) => {
        resultRef.current = {
            ...resultRef.current,
            [field.name]: field.defaultValue,
        };
        errorsRef.current = {
            ...errorsRef.current,
            [field.name]: getError(field, field.defaultValue),
        };
        return (value) => {
            setResult(result => ({
                ...resultRef.current,
                ...result,
                [field.name]: value,
            }));
            setErrors(errors => ({
                ...errorsRef.current,
                ...errors,
                [field.name]: getError(field, value),
            }));
        };
    };
    const onSubmit = (handleSubmit) => (event) => {
        event.preventDefault && event.preventDefault();
        setResult(getNewResult);
        setErrors(getNewErrors);
        handleSubmit({
            result: getNewResult(result),
            errors: getNewErrors(errors),
            isError: Object.values(getNewErrors(errors)).reduce((str, item) => str + item, '') !== '',
        });
    };
    return {
        onChange,
        onSubmit,
        errors,
    };
}

import React, { Component, Fragment } from 'react';
import isEmpty from 'ramda/es/isEmpty';
import equals from 'ramda/es/equals';
import checkLength from './checkLength';
import checkSpecial from './checkSpecial';
import checkPresence from './checkPresence';
import getObjectFromFields from './getObjectFromFields';
import throwErrorType from './throwErrorType';
import throwErrorField from './throwErrorField';
import throwErrorFnExist from './throwErrorFnExist';
export class Form extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            fields: [],
            constraints: {},
            errors: {},
            result: {},
        };
        this._afterMount = false;
        this._setState = () => {
            const { defaultResult, defaultErrors, fields, constraints } = this.props;
            return new Promise(resolve => {
                this.setState({
                    fields,
                    result: {
                        ...getObjectFromFields(fields, ''),
                        ...(defaultResult ?? {}),
                    },
                    constraints: {
                        ...getObjectFromFields(fields, {}),
                        ...(constraints ?? {}),
                    },
                    errors: defaultErrors ?? {},
                }, resolve);
            });
        };
        this._getDefineRenderFields = () => {
            const { defineRenderFields } = this.props;
            return defineRenderFields;
        };
        this._getPatterns = (type) => {
            const { constraints } = this.state;
            return constraints[type]?.special?.pattern;
        };
        this._validFieldSpecial = (type, value) => {
            const pattern = this._getPatterns(type);
            return value.length > 0 && pattern?.test(String(value));
        };
        // trả về true nếu mảng errors rỗng
        // nghĩa là không có lỗi xảy ra
        this._getValid = () => {
            const { errors } = this.state;
            const messageErrors = Object.keys(errors).reduce((arr, name) => {
                const { message } = errors[name];
                return [...arr, ...(!!message ? [message] : [])];
            }, []);
            return isEmpty(messageErrors);
        };
        this._handleFormOnChange = (fn) => {
            const { result, errors } = this.state;
            const valid = this._getValid();
            fn({ result, valid, errors });
        };
        // check những trường hợp có điền patterns
        this._checkFieldSpecial = (name, value, special) => {
            return !this._validFieldSpecial(name, value) ? special?.message : '';
        };
        this._hasValue = (value) => {
            return typeof value === 'object' ? !isEmpty(value) : !!value;
        };
        this._getMessageErrorFocus = (name, required, value) => {
            const { constraints } = this.state;
            const { presence, length, special } = constraints[name];
            if (!!presence && required && !this._hasValue(value)) {
                return presence.message;
            }
            if (!!length && required && (value.length <= (length.minimum || -1) || value.length >= (length.maximum || Infinity))) {
                return length.message;
            }
            if (!!special && required && value.length > 0) {
                return this._checkFieldSpecial(name, value, special);
            }
            return '';
        };
        this._getMessageErrorBeforeSubmit = (name, required, value) => {
            const { constraints } = this.state;
            const { presence, length, special } = constraints[name];
            if (!!presence && required && !this._hasValue(value)) {
                return presence.message;
            }
            if (!!length && value.length > 0 && (value.length <= (length.minimum || -1) || value.length >= (length.maximum || Infinity))) {
                return length.message;
            }
            if (!!special && value.length > 0) {
                return this._checkFieldSpecial(name, value, special);
            }
            return '';
        };
        this._setResult = (name, value) => {
            const { result } = this.state;
            this.setState({
                result: {
                    ...result,
                    [name]: value,
                },
            });
        };
        this._setErrors = (name, error) => {
            const { errors } = this.state;
            this.setState({
                errors: {
                    ...errors,
                    [name]: {
                        status: !!error,
                        message: !!error ? error : '',
                    },
                },
            });
        };
        this._handleFieldFocus = (name, required) => (value) => {
            const error = this._getMessageErrorFocus(name, required, value) ?? '';
            this._setErrors(name, error);
        };
        this._getMessageErrorFieldChange = ({ name, value, required }) => {
            const { constraints } = this.state;
            const { length, presence, special } = constraints[name];
            if (checkLength({ length, presence, special, value, required })) {
                return length?.message;
            }
            if (!!special && checkSpecial({ length, presence, special, value, required })) {
                return this._checkFieldSpecial(name, value, special);
            }
            if (checkPresence({ presence, required, value })) {
                return presence?.message;
            }
            return '';
        };
        this._handleDefaultFieldChange = (name, required) => (value) => {
            const error = this._getMessageErrorFieldChange({
                name,
                value,
                required,
            }) ?? '';
            this._setErrors(name, error);
            this._setResult(name, value);
        };
        this._handleBeforeSubmit = async () => {
            const { result, fields, errors } = this.state;
            const getObj = (value) => {
                return fields.reduce((obj, item) => {
                    return {
                        ...obj,
                        [item.name]: item[value],
                    };
                }, {});
            };
            await this.setState({
                errors: {
                    ...errors,
                    ...Object.keys(result).reduce((obj, name) => {
                        const value = result[name];
                        const required = getObj('required')[name];
                        const error = this._getMessageErrorBeforeSubmit(name, required, value) ?? '';
                        return {
                            ...obj,
                            [name]: {
                                status: !!error,
                                message: !!error ? error : '',
                            },
                        };
                    }, {}),
                },
            });
        };
        this._handleSubmit = async () => {
            const { onSubmit } = this.props;
            const { result } = this.state;
            await this._handleBeforeSubmit();
            const { errors } = this.state;
            const valid = this._getValid();
            onSubmit?.({ result, valid, errors });
        };
        this._renderItem = (item, index) => {
            const { errors, result } = this.state;
            const { type, name, required } = item;
            const errorDefault = {
                status: false,
                message: '',
            };
            const error = errors[item.name] || errorDefault;
            const itemGeneral = {
                ...item,
                error,
                defaultValue: result[name],
                onChange: this._handleDefaultFieldChange(name, required),
                onFocus: this._handleFieldFocus(name, required),
                index,
            };
            const defineRenderFields = this._getDefineRenderFields();
            const defineFieldKeys = Object.keys(defineRenderFields);
            for (let i = 0; i < defineFieldKeys.length; i += 1) {
                const key = defineFieldKeys[i];
                if (type === key) {
                    const fn = defineRenderFields[key];
                    const { props } = this;
                    throwErrorFnExist(!!props[fn], type);
                    return props[fn](itemGeneral);
                }
            }
            return throwErrorType(itemGeneral, defineRenderFields);
        };
        this._handleItem = (item, index, fields) => {
            const { renderElementWithIndex } = this.props;
            if (!!renderElementWithIndex) {
                const { render, moveByIndex } = renderElementWithIndex;
                const _getIndex = moveByIndex(fields.length);
                const _index = _getIndex > fields.length - 1 ? fields.length - 1 : _getIndex;
                throwErrorField(item);
                const elementWithIndex = <Fragment key="___elementWithIndex___">{render(this._handleSubmit)}</Fragment>;
                return [
                    _getIndex < 0 && index === 0 && elementWithIndex,
                    <Fragment key={item.name}>{this._renderItem(item, index)}</Fragment>,
                    index === _index && elementWithIndex,
                ];
            }
            return <Fragment key={item.name}>{this._renderItem(item, index)}</Fragment>;
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (!isEmpty(prevState.fields) && !equals(nextProps.fields, prevState.fields)) {
            return {
                fields: nextProps.fields,
            };
        }
        return null;
    }
    async componentDidMount() {
        const { customSubmit, onMount } = this.props;
        // setState component ready
        await this._setState();
        // xử lý prop onChange
        !!onMount && this._handleFormOnChange(onMount);
        // customSubmit
        customSubmit?.(this._handleSubmit);
        this._afterMount = true;
    }
    componentDidUpdate(prevProps, prevState) {
        const { onChange, fields, defaultResult } = this.props;
        const { result, fields: stateFields } = this.state;
        if (!equals(fields, prevProps.fields) || !equals(stateFields, prevState.fields) || !equals(defaultResult, prevProps.defaultResult)) {
            this._setState();
        }
        if (!equals(result, prevState.result) && this._afterMount && !!onChange) {
            this._handleFormOnChange(onChange);
        }
    }
    render() {
        const { fields } = this.state;
        return !isEmpty(fields) && fields.map(this._handleItem);
    }
}
Form.defaultProps = {
    constraints: {},
    defaultResult: {},
    defaultErrors: {},
    onSubmit: () => { },
    onChange: () => { },
    onMount: () => { },
    customSubmit: () => { },
    renderElementWithIndex: {
        render: () => null,
        moveByIndex: (dataLength) => dataLength - 1,
    },
    defineRenderFields: {},
};

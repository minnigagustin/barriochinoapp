import React, { PureComponent } from 'react';
import { Keyboard } from 'react-native';
import { FormItem, Button, Input, Icons, View, Text } from "../../shared";
import { Form as SForm } from "../../shared";
export default class Form extends PureComponent {
    constructor() {
        super(...arguments);
        this._submitEditing = () => {
            Keyboard.dismiss();
        };
        this.updateRef = (name) => (ref) => {
            // @ts-ignore
            this[name] = ref;
        };
        this._handleMoveByIndex = (dataLength) => {
            return dataLength;
        };
        this._handleListenChange = (result) => {
            const { onChangeResult } = this.props;
            this.setState({
                result,
            });
            onChangeResult?.(result);
        };
        this._handleSubmit = (index) => () => {
            const { fields } = this.props;
            if (index !== fields.length - 1) {
                if (index !== undefined) {
                    const inputName = fields[index + 1].name;
                    // @ts-ignore
                    this[`${inputName}_${index + 1}`].focus();
                    return;
                }
            }
            else {
                this._submitEditing();
            }
        };
        this._customSubmit = (handleSubmit) => {
            this._submitEditing = handleSubmit;
        };
        this._renderInput = ({ label, name, placeholder, required, icon, error, onChange, onFocus, type, index }) => {
            const { fields } = this.props;
            return (<FormItem label={label} errorMessage={error?.message} required={required}>
        <Input placeholder={`${placeholder} ${required ? '*' : ''}`} Right={!!icon ? <Icons.Feather name={icon} size={20} color="dark3" style={{ marginHorizontal: 10 }}/> : null} onChangeText={onChange} onFocusText={onFocus} secureTextEntry={type === 'password'} inputRef={this.updateRef(`${name}_${index}`)} onSubmitEditing={this._handleSubmit(index)} returnKeyType={index !== fields.length - 1 ? 'next' : 'go'} 
            // returnKeyLabel={index !== fields.length - 1 ? 'Next' : 'Login'}
            autoCapitalize="none" placeholderTextColor="#999" autoCorrect={false}/>
      </FormItem>);
        };
        this._renderButtonSubmit = (handleSubmit) => {
            const { buttonText, buttonLoading, customText } = this.props;
            return (<View>
        {customText?.()}
        <Button block onPress={handleSubmit} tachyons={['wAuto', 'br2']} loading={buttonLoading}>
          <Text style={{ color: '#fff' }}>{buttonText}</Text>
        </Button>
      </View>);
        };
    }
    render() {
        const { fields, onSubmit, constraints, defaultResult } = this.props;
        return (<View>
        <SForm fields={fields} defineRenderFields={{
            text: 'renderInput',
            password: 'renderInput',
        }} constraints={constraints} defaultResult={defaultResult} renderInput={this._renderInput} onSubmit={onSubmit} onChange={this._handleListenChange} renderElementWithIndex={{
            render: this._renderButtonSubmit,
            moveByIndex: this._handleMoveByIndex,
        }} customSubmit={this._customSubmit}/>
      </View>);
    }
}

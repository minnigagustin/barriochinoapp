import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import PropTypes from "prop-types";
import Constants from "expo-constants";
import axios from "axios";
import { isEmpty } from "lodash";
import {
  Validator,
  InputMaterial,
  FontIcon,
  ModalPicker,
  Button,
  CheckBox,
  KeyboardSpacer,
  Loader,
} from "../../../wiloke-elements";
import validateData from "../../../utils/validateData";
import * as Consts from "../../../constants/styleConstants";
import { Feather } from "@expo/vector-icons";

export default class FormBilling extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      stateOptions: [],
      countrySelected: "",
      isVisible: false,
    };
  }
  static propTypes = {
    data: PropTypes.array,
    onSubmit: PropTypes.func,
    defaultResult: PropTypes.object,
    onCloseModal: PropTypes.func,
    onChecked: PropTypes.func,
  };

  static defaultProps = {
    data: [],
  };

  _handleChangeOptions = (props) => async (options, selected) => {
    if (props.name === "billing_state") {
      props.onChange(selected[0].id);
    }
    if (props.name === "billing_country") {
      try {
        await this.setState({
          countrySelected: selected[0].id,
          isVisible: true,
        });
        const { data } = await axios.get(
          `wc/billing-fields/state?country=${this.state.countrySelected}`
        );
        if (data.status === "success" && data.options.length > 0) {
          this.setState({
            stateOptions: data.options,
          });
        }
        this.setState({
          isVisible: false,
        });
        props.onChange(selected[0].id);
      } catch (err) {
        console.log(err);
      }
    }
  };

  _handleChangeText = (props) => (text) => {
    this.setState({
      [`${props.name}`]: text,
    });
    props.onChange(text);
  };
  _handleClearText = (props) => () => {
    this._handleChangeText(props)("");
  };

  _handleSubmit = async (props) => {
    const { onSubmit } = this.props;
    if (props.valid) {
      onSubmit(props.result, false);
    } else {
      console.log(props.errors);
    }
  };

  _handlePressCheck = (props) => async (name, checked) => {
    const { onChecked } = this.props;
    props.onChange(checked);
    onChecked(checked);
  };

  _renderTextInput = (props) => {
    const { translations } = this.props;
    return (
      <View key={props.name}>
        <InputMaterial
          placeholder={translations[props.label]}
          required={props.required}
          name={props.name}
          value={this.state[`${props.name}`]}
          onFocus={() => props.onFocus(this.state[`${props.name}`])}
          onChangeText={this._handleChangeText(props)}
          onClearText={this._handleClearText(props)}
          defaultValue={props.defaultValue}
        />
        <Text style={styles.validate}>{props.error.message}</Text>
      </View>
    );
  };

  _renderSelectBox = (props) => {
    const { translations } = this.props;
    if (
      props.name === "billing_state" &&
      isEmpty(this.state.stateOptions) &&
      isEmpty(props.options)
    ) {
      return null;
    }
    return (
      <View style={{ paddingVertical: 10 }} key={props.name}>
        <ModalPicker
          options={
            props.name === "billing_state"
              ? this.state.stateOptions
              : props.options
          }
          required={props.required}
          placeholder={props.label}
          label={translations[props.label]}
          enabledSearch={true}
          onChangeOptions={this._handleChangeOptions(props)}
          matterial={true}
          multiple={false}
          clearSelectEnabled={false}
          // containerStyle={{ paddingVertical: 0 }}
        />
      </View>
    );
  };

  _renderCheckbox = (props) => {
    const { translations } = this.props;
    return (
      <CheckBox
        checked={props.defaultValue}
        label={props.label}
        name={props.name}
        reverse
        key={props.name}
        style={{ paddingTop: 10, paddingBottom: 5 }}
        onPress={this._handlePressCheck(props)}
      />
    );
  };

  _renderHeader = () => {
    const { onCloseModal, title, colorPrimary } = this.props;
    return (
      <View style={[styles.header, { backgroundColor: colorPrimary }]}>
        <TouchableOpacity style={styles.icon} onPress={onCloseModal}>
          <FontIcon name="x" size={25} color="#fff" />
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    );
  };

  render() {
    const {
      data,
      defaultResult,
      title,
      translations,
      isLoading,
      colorPrimary,
    } = this.props;
    const { isVisible } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {this._renderHeader()}
        <ScrollView style={styles.form} keyboardShouldPersistTaps="always">
          <Validator
            fields={data}
            validateData={translations.validationData}
            onSubmit={this._handleSubmit}
            renderSelectBox={this._renderSelectBox}
            renderTextInput={this._renderTextInput}
            renderCheckbox={this._renderCheckbox}
            defaultResult={defaultResult}
            renderElementWithIndex={{
              render: (handleSubmit) => {
                return (
                  <Button
                    {...this.props}
                    backgroundColor="primary"
                    colorPrimary={colorPrimary}
                    size="md"
                    block={true}
                    isLoading={isLoading}
                    textStyle={{ fontSize: 17 }}
                    onPress={handleSubmit}
                    radius="round"
                  >
                    {title}
                  </Button>
                );
              },
              moveByIndex: (dataLength) => {
                return dataLength;
              },
            }}
            style={{ flex: 1 }}
          />
        </ScrollView>
        {Platform.OS === "ios" && <KeyboardSpacer />}
        <Modal
          visible={isVisible}
          onRequestClose={() => console.log("close")}
          transparent={true}
          animationType="fade"
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Loader size="small" />
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {},
  form: {
    paddingHorizontal: 13,
    paddingBottom: 15,
    marginBottom: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 7,
  },
  validate: {
    color: "red",
    fontSize: 11,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 52 + Constants.statusBarHeight,
    paddingTop: Constants.statusBarHeight,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  icon: {
    paddingHorizontal: 13,
  },
});

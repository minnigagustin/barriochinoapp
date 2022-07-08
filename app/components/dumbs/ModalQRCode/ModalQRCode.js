import React, { PureComponent } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Modal from "react-native-modal";
import { ContentBox, Button } from "../../../wiloke-elements";
import * as Consts from "../../../constants/styleConstants";
import styles from "./styles";

export default class ModalQRCode extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool,
    colorPrimary: PropTypes.string,
    cancelText: PropTypes.string,
    submitText: PropTypes.string,
    onBackdropPress: PropTypes.func,
    onSubmitAsync: PropTypes.func,
    loadingButton: PropTypes.bool,
  };
  static defaultProps = {
    colorPrimary: Consts.colorPrimary,
    cancelText: "Cancel",
    submitText: "Submit",
    onSubmitAsync: () => {},
    onBackdropPress: () => {},
    loadingButton: false,
  };

  state = {
    isModalVisible: false,
  };

  componentDidMount() {
    const { isVisible } = this.props;
    this.setState({
      isModalVisible: isVisible,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { isVisible } = this.props;
    if (prevProps.isVisible !== isVisible) {
      this.setState({
        isModalVisible: isVisible,
      });
    }
  }

  _handleBackdropPress = () => {
    this.setState({
      isModalVisible: false,
    });
    this.props.onBackdropPress();
  };

  _handleSubmit = async () => {
    const { onSubmitAsync } = this.props;
    await (typeof onSubmitAsync === "function" && onSubmitAsync());
  };

  renderFooter = () => {
    const {
      onSubmitAsync,
      cancelText,
      submitText,
      colorPrimary,
      loadingButton,
    } = this.props;
    const { isLoading } = this.state;
    return (
      <View style={styles.footer}>
        <Button
          backgroundColor="gray"
          color="dark"
          size="sm"
          radius="round"
          onPress={this._handleBackdropPress}
        >
          {cancelText}
        </Button>
        <View style={{ width: 5 }} />
        {typeof onSubmitAsync === "function" && (
          <Button
            backgroundColor="primary"
            colorPrimary={colorPrimary}
            size="sm"
            radius="round"
            onPress={this._handleSubmit}
            isLoading={loadingButton}
          >
            {submitText}
          </Button>
        )}
      </View>
    );
  };

  render() {
    const { isVisible, children, colorPrimary, ...modalProps } = this.props;
    const { isModalVisible } = this.state;
    return (
      <View>
        <Modal
          {...modalProps}
          isVisible={isModalVisible}
          onBackdropPress={this._handleBackdrop}
          hideModalContentWhileAnimating={true}
          useNativeDriver={true}
        >
          <ContentBox
            {...this.props}
            renderFooter={this.renderFooter}
            style={{ borderRadius: 5 }}
            headerStyle={styles.pt8}
            footerStyle={styles.pt8}
            colorPrimary={colorPrimary}
          >
            {children}
          </ContentBox>
        </Modal>
      </View>
    );
  }
}

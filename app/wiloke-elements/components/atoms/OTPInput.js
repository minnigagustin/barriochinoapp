import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Row, Col } from "../molecules/Grid";
import { colorGray1 } from "../../../constants/styleConstants";

class OtpInputs extends React.Component {
  state = { otp: [] };
  otpTextInput = [];

  componentDidMount() {
    // console.log(this.otpTextInput[0]);
    this.otpTextInput[0].focus();
  }

  renderInputs() {
    const inputs = Array(6).fill(0);
    const txt = inputs.map((item, index) => (
      <Col key={index} column={6} gap={10}>
        <TextInput
          style={[styles.inputRadius]}
          keyboardType="numeric"
          onChangeText={(text) => this.focusNext(index, text)}
          onKeyPress={(e) => this.focusPrevious(e.nativeEvent.key, index)}
          ref={(ref) => (this.otpTextInput[index] = ref)}
          maxLength={1}
        />
      </Col>
    ));
    return txt;
  }

  focusPrevious(key, index) {
    if (key === "Backspace" && index !== 0)
      this.otpTextInput[index - 1].focus();
  }

  focusNext(index, value) {
    if (index < this.otpTextInput.length - 1 && value) {
      this.otpTextInput[index + 1].focus();
    }
    if (index === this.otpTextInput.length - 1) {
      this.otpTextInput[index].blur();
    }
    const otp = this.state.otp;
    otp[index] = value;
    this.setState({ otp });
    this.props.onChangeCode(otp.join(""));
  }

  render() {
    return (
      <View style={styles.container}>
        <Row gap={10}>{this.renderInputs()}</Row>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  txtMargin: { margin: 3 },
  inputRadius: {
    textAlign: "center",
    borderWidth: 1,
    borderColor: colorGray1,
    width: 40,
    height: 50,
    borderRadius: 5,
  },
});

export default OtpInputs;

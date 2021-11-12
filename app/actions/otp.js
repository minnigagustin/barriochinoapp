import axios from "axios";
import * as types from "../constants/actionTypes";

export const unlockOTP = (password) => async (dispatch) => {
  try {
    const endpoint = "/otp/unlock-enable-otp";
    const { data } = await axios.post(endpoint, {
      password,
    });
    dispatch({
      type: types.UNLOCK_OTP,
      payload: data,
    });
  } catch (err) {
    console.log("unlock-otp");
    console.log(err.response);
  }
};

export const verifyOTP = (code) => async (dispatch) => {
  try {
    const endpoint = "otp/enable";
    const { data } = await axios.post(endpoint, {
      otp_code: code,
    });

    dispatch({
      type: types.VERIFY_OTP,
      payload: data,
    });
  } catch (err) {
    console.log("verify-otp");
    console.log(err.response);
  }
};
export const resetOTP = () => (dispatch) => {
  dispatch({
    type: types.RESET_OTP,
  });
};

export const disableOTP = (password) => async (dispatch) => {
  try {
    const endpoint = "/otp/disable";
    const { data } = await axios.post(endpoint, {
      password,
    });
    dispatch({
      type: types.DISABLE_OTP,
      payload: data,
    });
  } catch (err) {
    console.log("disable-otp");
    console.log(err.response);
  }
};

import * as types from "../constants/actionTypes";

const initialState = {
  unlockOtp: {},
  verifyOTP: {},
  disableOtp: {},
};

const otpReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UNLOCK_OTP:
      return { ...state, unlockOtp: action.payload };
    case types.VERIFY_OTP:
      return { ...state, verifyOTP: action.payload };
    case types.RESET_OTP:
      return initialState;
    case types.DISABLE_OTP:
      return { ...state, disableOtp: action.payload };
    default:
      return state;
  }
};
export default otpReducer;

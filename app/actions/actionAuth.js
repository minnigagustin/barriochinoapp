import {
  LOGIN,
  LOGOUT,
  LOGIN_ERROR,
  LOGIN_LOADING,
  CHECK_TOKEN,
  SIGNUP,
  SIGNUP_ERROR,
  SIGNUP_LOADING,
} from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError, axiosHandleErrorString } from "../wiloke-elements";
const encodeId = (id) => `___${id}___`;
const decodeId = (id) => id.replace(/___/g, "");

export const login = (user) => (dispatch) => {
  dispatch({
    type: LOGIN_LOADING,
    loading: true,
  });
  dispatch({
    type: LOGIN,
    payload: { nextOTP: false },
  });
  return axios
    .post("auth", user)
    .then(({ data }) => {
      if (data.status === "success" && data.next === "verify-otp") {
        dispatch({
          type: LOGIN,
          payload: {
            nextOTP: data.next === "verify-otp",
          },
        });
        dispatch({
          type: LOGIN_LOADING,
          loading: false,
        });
        return;
      }
      const { token, status, msg, oUserInfo } = data;
      if (status === "success") {
        dispatch({
          type: LOGIN,
          payload:
            status && status !== "error"
              ? {
                  token,
                  isContributor: oUserInfo.isContributor,
                }
              : {},
        });
      } else if (status === "error") {
        dispatch({
          type: LOGIN_ERROR,
          err: msg,
        });
      }
      dispatch({
        type: LOGIN_LOADING,
        loading: false,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: LOGIN_LOADING,
        loading: false,
      });
    });
};

export const loginWithGoogle = (accessToken, user) => async (dispatch) => {
  dispatch({
    type: LOGIN,
    payload: { nextOTP: false },
  });
  try {
    const { data } = await axios.post("google/signIn", {
      token: accessToken,
    });
    if (data.status === "success") {
      dispatch({
        type: LOGIN,
        payload: {
          token: data.token,
          isContributor: data.oUserInfo.isContributor,
        },
      });
      return;
    } else {
      dispatch({
        type: LOGIN_ERROR,
        err: data.msg || "Login failed. Something error!",
      });
      return;
    }
  } catch (err) {
    dispatch({
      type: LOGIN_ERROR,
      err: axiosHandleErrorString(err),
    });
  }
};
export const loginFb = (id, token) => async (dispatch) => {
  dispatch({
    type: LOGIN,
    payload: { nextOTP: false },
  });
  try {
    const { data } = await axios.post("fb-signin", {
      fbUserID: id,
      accessToken: token,
    });

    if (data.next === "verify-otp") {
      return dispatch({
        type: LOGIN,
        payload: {
          nextOTP: data.next === "verify-otp",
        },
      });
    }
    if (data.status === "success") {
      return dispatch({
        type: LOGIN,
        payload: {
          token: data.token,
          isContributor: data.oUserInfo.isContributor,
        },
      });
    } else {
      dispatch({
        type: LOGIN,
        payload: { nextOTP: false },
      });
      dispatch({
        type: LOGIN_ERROR,
        err: data.data.message,
      });
    }
  } catch (err) {
    dispatch({
      type: LOGIN_ERROR,
      err: axiosHandleErrorString(err),
    });
  }
};

export const requireOTPCode = (email) => async (dispatch) => {
  dispatch({
    type: LOGIN,
    payload: { nextOTP: false },
  });
  try {
    const { data } = await axios.post("login/otp/send", {
      usernameOrEmail: email,
    });
    if (data.status === "success") {
      dispatch({
        type: LOGIN,
        payload: { nextOTP: true },
      });
      return;
    } else {
      dispatch({
        type: LOGIN,
        payload: { nextOTP: false },
      });
      dispatch({
        type: LOGIN_ERROR,
        err: data.msg,
      });
    }
  } catch (error) {
    dispatch({
      type: LOGIN_ERROR,
      err: axiosHandleErrorString(error),
    });
  }
};

export const loginApple = (authCode, identityToken, email) => async (
  dispatch
) => {
  dispatch({
    type: LOGIN,
    payload: { nextOTP: false },
  });
  try {
    const { data } = await axios.post("apple-signin", {
      authorizationCode: authCode,
      email,
      identityToken,
    });
    if (data.next === "verify-otp") {
      dispatch({
        type: LOGIN,
        payload: {
          nextOTP: data.next === "verify-otp",
        },
      });
      return;
    }
    if (data.status === "success") {
      dispatch({
        type: LOGIN,
        payload: {
          token: data.token,
          isContributor: data.oUserInfo.isContributor,
        },
      });
    } else {
      dispatch({
        type: LOGIN,
        payload: {
          nextOTP: false,
        },
      });
      dispatch({
        type: LOGIN_ERROR,
        err: data.msg,
      });
    }
  } catch (err) {
    dispatch({
      type: LOGIN_ERROR,
      err: axiosHandleErrorString(err),
    });
  }
};

export const logout = (myID) => (dispatch, getState) => {
  dispatch({
    type: LOGOUT,
    message: "logout",
  });
  const { db } = getState();
  if (!db || !myID) return;
  db.ref(`deviceTokens/${encodeId(myID)}/token`).set("");
};

export const checkToken = (myID) => (dispatch, getState) => {
  return axios
    .get("is-token-living")
    .then(({ data }) => {
      dispatch({
        type: CHECK_TOKEN,
        isLoggedIn: data.status === "success" ? true : false,
        message: !!data.msg ? data.msg : "",
      });
      const { db } = getState();
      if (!db) return;
      if (data.status !== "success") {
        db.ref(`deviceTokens/${encodeId(myID)}/token`).set("");
      }
    })
    .catch((err) => {
      console.log(axiosHandleErrorString(err));
    });
};

export const register = (user) => (dispatch) => {
  dispatch({
    type: SIGNUP_LOADING,
    loading: true,
  });
  return axios
    .post("signup", user)
    .then(({ data }) => {
      const { token } = data;
      if (data.status === "success") {
        dispatch({
          type: SIGNUP,
          payload: {
            token,
            isContributor: data.oUserInfo.isContributor,
          },
        });
      } else if (data.status === "error") {
        dispatch({
          type: SIGNUP_ERROR,
          err: data.msg,
        });
      }
      dispatch({
        type: SIGNUP_LOADING,
        loading: false,
      });
    })
    .catch((err) => {
      dispatch({
        type: SIGNUP_LOADING,
        loading: false,
      });
    });
};

export const loginWithOTP = (code, isLoginByPluginOTPCode = false) => async (
  dispatch
) => {
  try {
    const endpoint = isLoginByPluginOTPCode ? "login/otp/verify" : "otp/verify";
    const params = isLoginByPluginOTPCode
      ? { otpCode: code }
      : { otp_code: code };
    const { data } = await axios.post(endpoint, params);
    if (data.status === "success") {
      dispatch({
        type: LOGIN,
        payload: {
          token: !!data.token ? data.token : null,
          isContributor: !!data.token ? data.oUserInfo.isContributor : false,
        },
      });
    } else {
      dispatch({
        type: LOGIN_ERROR,
        err: data.msg || "Oops! Some thing wrong.",
      });
    }
  } catch (err) {
    console.log("login otp ", err);
  }
};

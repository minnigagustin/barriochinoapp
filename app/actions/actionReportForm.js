import { GET_REPORT_FORM, GET_REPORT_MESSAGE } from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";
import { Alert } from "react-native";

export const getReportForm = (_) => (dispatch) => {
  return axios
    .get("get-report-fields")
    .then(({ data }) => {
      console.log({ data });
      if (data.status === "success") {
        dispatch({
          type: GET_REPORT_FORM,
          payload: data.oResults,
        });
      } else {
        dispatch({
          type: GET_REPORT_FORM,
          payload: data.data.msg,
        });
      }
    })
    .catch((err) => console.log("error report form", err));
};

export const postReport = (postID, data) => (dispatch) => {
  return axios
    .post("post-report", {
      postID,
      data,
    })
    .then(({ data }) => {
      dispatch({
        type: GET_REPORT_MESSAGE,
        message: data.msg,
      });
    })
    .catch((err) => console.log(axiosHandleError(err)));
};

import { GET_SETTINGS } from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";
import Obteneridioma from "../utils/traducir"
export const getSettings = _ => async dispatch => {
  return axios
    .get(`general-settings?lang=${await Obteneridioma()}`)
    .then(res => {
      dispatch({
        type: GET_SETTINGS,
        payload: res.data
      });
    })
    .catch(err => console.log(axiosHandleError(err)));
};

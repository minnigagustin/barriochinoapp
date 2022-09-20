import { GET_TRANSLATIONS } from "../constants/actionTypes";
import axios from "axios";
import { isEmpty, axiosHandleError } from "../wiloke-elements";
import { decodeObject } from "../utils/decodeObject";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Obteneridioma from "../utils/traducir"

export const getTranslations = _ => async dispatch => {
  return axios
    .get(`translations?lang=${await Obteneridioma()}`)
    .then(res => {
      dispatch({
        type: GET_TRANSLATIONS,
        payload: isEmpty(res.data.oResults)
          ? {}
          : decodeObject(res.data.oResults)
      });
    })
    .catch(err => console.log(axiosHandleError(err)));
};

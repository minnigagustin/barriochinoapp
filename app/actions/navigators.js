import * as types from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Obteneridioma from "../utils/traducir"

export const getTabNavigator = _ => dispatch => {
  return Obteneridioma().then(Response => { // llamo el metodo y en el then coloco la logica de llamado
    let idioma = Response;
    axios
    .get("navigators/tabNavigator?lang=" + idioma)
    .then(res => {
      const payload = res.data.oResults.filter(
        item => item.status === "enable"
      );
      dispatch({
        type: types.GET_TAB_NAVIGATOR,
        payload
      });
    })
    })
    .catch(err => console.log(axiosHandleError(err)));
};

export const getStackNavigator = _ => dispatch => {
  dispatch({
    type: types.MENU_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get("navigators/stackNavigator")
    .then(res => {
      const payload = res.data.oResults.filter(
        item => item.status === "enable"
      );
      dispatch({
        type: types.GET_STACK_NAVIGATOR,
        payload
      });
      dispatch({
        type: types.MENU_REQUEST_TIMEOUT,
        isTimeout: false
      });
    })
    .catch(err => {
      dispatch({
        type: types.MENU_REQUEST_TIMEOUT,
        isTimeout: true
      });
      console.log(axiosHandleError(err));
    });
};

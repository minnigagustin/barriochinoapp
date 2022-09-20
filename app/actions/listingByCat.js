import {
  LOADING,
  GET_LISTING_BY_CAT,
  GET_LISTING_BY_CAT_LOADMORE,
} from "../constants/actionTypes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";
import Obteneridioma from "../utils/traducir"

const POSTS_PER_PAGE = 10;


export const getListingByCat = (categoryId, taxonomy, endpointAPI) =>
  async dispatch => {
  dispatch({
    type: LOADING,
    loading: true,
  });
  axios
    .get(endpointAPI, {
      params: {
        lang: await Obteneridioma(),
        page: 1,
        postsPerPage: 10,
        [taxonomy]: categoryId,
        isGetListingByCat: 'yes',
        taxonomy
      },
    })
    .then((res) => {
      console.log({ res });
      dispatch({
        type: GET_LISTING_BY_CAT,
        payload: res.data,
      });
      dispatch({
        type: LOADING,
        loading:
          (res.data.oResults && res.data.oResults.length > 0) ||
          res.data.status === "error"
            ? false
            : true,
      });
    })
    .catch((err) => console.log(axiosHandleError(err)));
};

export const getListingByCatLoadmore = (
  next,
  categoryId,
  taxonomy,
  endpointAPI
) => async dispatch => {
  return axios
    .get(endpointAPI, {
      params: {
        lang: await Obteneridioma(),
        page: next,
        postsPerPage: POSTS_PER_PAGE,
        [taxonomy]: categoryId,
      },
    })
    .then((res) => {
      dispatch({
        type: GET_LISTING_BY_CAT_LOADMORE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(axiosHandleError(err)));
};

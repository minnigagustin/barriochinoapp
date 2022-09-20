import * as types from "../constants/actionTypes";
import axios from "axios";
import _ from "lodash";
import { axiosHandleError } from "../wiloke-elements";
import Obteneridioma from "../utils/traducir"

const POSTS_PER_PAGE = 12;

export const getListingSearchResults = (results) => async dispatch => {
  dispatch({
    type: types.LOADING,
    loading: true,
  });
  dispatch({
    type: types.LISTING_SEARCH_REQUEST_TIMEOUT,
    isTimeout: false,
  });
  const params = _.pickBy(
    {
      postsPerPage: POSTS_PER_PAGE,
      page: 1,
      lang: await Obteneridioma(),
      ...results,
    },
    _.identity
  );

  return axios
    .get(`list/listings`, {
      params,
    })
    .then((res) => {
      console.log({ res });
      dispatch({
        type: types.GET_LISTING_SEARCH_RESULTS,
        payload: res.data,
      });
      dispatch({
        type: types.LOADING,
        loading:
          (res.data.oResults && res.data.oResults.length > 0) ||
          res.data.status === "error"
            ? false
            : true,
      });
      dispatch({
        type: types.LISTING_SEARCH_REQUEST_TIMEOUT,
        isTimeout: false,
      });
    })
    .catch((err) => {
      dispatch({
        type: types.LISTING_SEARCH_REQUEST_TIMEOUT,
        isTimeout: true,
      });
      console.log(axiosHandleError(err));
    });
};

export const getListingSearchResultsLoadmore = (next, results) => async (
  dispatch
) => {
  const endpoint = "list/listings";
  try {
    const { data } = await axios.get(endpoint, {
      params: {
        page: next,
        postsPerPage: POSTS_PER_PAGE,
        ...results,
      },
    });
    const nextList = data.status === "success" ? data.oResults : [];
    dispatch({
      type: types.GET_LISTING_SEARCH_RESULTS_LOADMORE,
      payload: {
        next: data.next,
        oResults: nextList,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

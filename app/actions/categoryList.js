import * as types from "../constants/actionTypes";
import axios from "axios";
import he from "he";
import { zeroPad, axiosHandleError } from "../wiloke-elements";
import Obteneridioma from "../utils/traducir"

export const getCategoryList = (postType, categoryAllName) => async dispatch => {
  return axios
    .get("taxonomies/listing-categories", {
      params: {
        lang: await Obteneridioma(),
        postType,
      },
    })
    .then((res) => {
      if (res.data.status === "success") {
        const categoryList = [
          {
            id: "wilokeListingCategory",
            name: categoryAllName,
            selected: true,
          },
          ...res.data.aTerms.map((item, index) => ({
            id: item.term_id,
            // name: `${he.decode(item.name)} (${zeroPad(item.count)})`,
            name: `${he.decode(item.name)}`,
            selected: false,
          })),
        ];
        dispatch({
          type: types.GET_CATEGORY_LIST,
          payload: {
            [postType]: res.data.aTerms ? categoryList : res.data.msg,
          },
        });
      }
    })
    .catch((err) => console.log(axiosHandleError(err)));
};

export const changeCategoryList = (categoryList, postType) => (dispatch) => {
  dispatch({
    type: types.CHANGE_CATEGORY_LIST,
    payload: {
      [postType]: categoryList,
    },
  });
};

export const resetSelectedCatagoryList = (_) => (dispatch) => {
  dispatch({
    type: types.RESET_SELECTED_CATEGORY_LIST,
  });
};

import * as types from "../constants/actionTypes";
import axios from "axios";
import { filterMax, axiosHandleError } from "../wiloke-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import Obteneridioma from "../utils/traducir"

/**
 * GET LISTING DETAIL
 * @param {*} id listing
 */

export const getListingDetail = (id) => async dispatch => {

    axios
    .get(`listings/${id}?lang=${await Obteneridioma()}` )
    .then((res) => {
      const { oAdmob } = res.data;
      const {
        oReview,
        oFavorite,
        oNavigation,
        oHomeSections,
        oAuthor,
        oButton,
        isReport,
        header,
        instafeedhub,
        isEditable,
        isSubmittable,
      } = res.data.oResults;
      dispatch({
        type: types.GET_LISTING_DETAIL,
        payload: {
          [`${id}_details`]: {
            isEditable,
            isSubmittable,
            header,
            instafeedhub,
            oReviews: oReview,
            oFavorite,
            oNavigation,
            oHomeSections,
            oButton,
            isReport,
            oAuthor,
            oAdmob,
          },
        },
      });
      dispatch({
        type: types.ADD_LISTING_DETAIL_FAVORITES,
        id: oFavorite.isMyFavorite !== "no" ? `${id}_details` : null,
      });
    })
    .catch((err) => console.log(axiosHandleError(err)));
};

export const loadedListingDetail = (id = null) => (dispatch) => {
  dispatch({
    type: types.LOADED_LISTING_DETAILS,
    id,
  });
};

/**
 * GET LISTING DETAIL DESCRIPTIONS
 * @param {*} id listing
 * @param {*} key = content
 */
export const getListingDescription = (id, item, max, isLoading = false) => async dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: isLoading,
  });
  dispatch({
    type: types.LISTING_DETAIL_DES_REQUEST_TIMEOUT,
    isTimeout: false,
  });
  return axios
    .get(`listings/${id}/${item.key}`, {
      params: {
        lang: await Obteneridioma(),
        ...item,
      },
    })
    .then((res) => {
      const payload =
        res.data.status === "success" ? [res.data.oResults] : "__empty__";
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_DESTINATION,
          payload: { [`${id}_details`]: payload },
        });
      } else {
        dispatch({
          type: types.GET_LISTING_DESTINATION_ALL,
          payload: { [`${id}_details`]: payload },
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false,
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_DES_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch((err) => {
      // dispatch({
      //   type: types.LISTING_DETAIL_DES_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log("123", err);
    });
};

/**
 * GET LISTING DETAIL LIST FEATURE
 * @param {*} id listing
 * @param {*} key = tags
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingListFeature = (id, item, max) => async dispatch => {
  dispatch({
    type: types.LISTING_DETAIL_LIST_REQUEST_TIMEOUT,
    isTimeout: false,
  });
  return axios
    .get(`listings/${id}/${item.key}`, {
      params: {
        ...item,
        lang: await Obteneridioma(),
        maximumItemsOnHome: max !== "" ? max : null,
      },
    })
    .then((res) => {
      console.log("feature", res);
      const payload =
        res.data.status === "success"
          ? res.data.oResults.reduce((arr, item) => {
              return [...arr, { ...item, ...item.oIcon }];
            }, [])
          : "__empty__";
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_LIST_FEATURE,
          payload: { [`${id}_details`]: payload },
        });
      } else {
        dispatch({
          type: types.GET_LISTING_LIST_FEATURE_ALL,
          payload: { [`${id}_details`]: payload },
        });
      }
    })
    .catch((err) => {
      console.log("123");
      console.log(err);
    });
};

/**
 * GET LISTING DETAIL PHOTOS
 * @param {*} id listing
 * @param {*} key = s
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingPhotos = (id, item, max) => async dispatch => {
  dispatch({
    type: types.LISTING_DETAIL_PHOTOS_REQUEST_TIMEOUT,
    isTimeout: false,
  });
  return axios
    .get(`listings/${id}/${item.key}`, {
      params: {
        ...item,
        lang: await Obteneridioma(),
        maximumItemsOnHome: max !== "" ? max : null,
      },
    })
    .then((res) => {
      const gallery = (maxItem) => {
        if (res.data.status === "success") {
          const { large, medium } = res.data.oResults;
          const galleryLarge = filterMax(large);
          const galleryMedium = filterMax(medium);
          return {
            large: !maxItem ? large : galleryLarge(maxItem),
            medium: !maxItem ? medium : galleryMedium(maxItem),
          };
        }
        return "__empty__";
      };
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_PHOTOS,
          payload: { [`${id}_details`]: gallery(false) },
        });
      } else {
        dispatch({
          type: types.GET_LISTING_PHOTOS_ALL,
          payload: { [`${id}_details`]: gallery(false) },
        });
      }
    })
    .catch((err) => {
      console.log("photos", err);
    });
};

export const resetListingDetail = () => (dispatch) => {
  dispatch({
    type: types.RESET_LISTING_DETAIL,
  });
};

/**
 * GET LISTING DETAIL VIDEOS
 * @param {*} id listing
 * @param {*} key = videos
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingVideos = (id, item, max) => (dispatch) => {
  dispatch({
    type: types.LISTING_DETAIL_VID_REQUEST_TIMEOUT,
    isTimeout: false,
  });
  return axios
    .get(`listings/${id}/${item.key}`, {
      params: {
        ...item,
        maximumItemsOnHome: max !== "" ? max : null,
      },
    })
    .then((res) => {
      const videos =
        res.data.status === "success" ? res.data.oResults : "__empty__";
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_VIDEOS,
          payload: { [`${id}_details`]: filterMax(videos)(1) },
        });
      } else {
        dispatch({
          type: types.GET_LISTING_VIDEOS_ALL,
          payload: { [`${id}_details`]: filterMax(videos)(12) },
        });
      }
      dispatch({
        type: types.LISTING_DETAIL_VID_REQUEST_TIMEOUT,
        isTimeout: false,
      });
    })
    .catch((err) => {
      dispatch({
        type: types.LISTING_DETAIL_VID_REQUEST_TIMEOUT,
        isTimeout: false,
      });
      console.log("videos", err);
    });
};

/**
 * GET LISTING DETAIL REVIEWS
 * @param {number} id listing
 * @param {string} key reviews
 * @param {number} max (maximumItemsOnHome)
 */
export const getListingReviews = (id, item, max) => async dispatch => {
  dispatch({
    type: types.LISTING_DETAIL_REVIEWS_REQUEST_TIMEOUT,
    isTimeout: false,
  });
  return axios
    .get(`listings/${id}/${item.key}`, {
      params: {
        ...item,
        lang: await Obteneridioma(),
        maximumItemsOnHome: max !== "" ? max : null,
      },
    })
    .then((res) => {
      const payload =
        res.data.status === "success" ? res.data.oResults : "__empty__";
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_REVIEWS,
          payload: { [`${id}_details`]: payload },
        });
      } else {
        dispatch({
          type: types.GET_LISTING_REVIEWS_ALL,
          payload: { [`${id}_details`]: payload },
        });
      }
    })
    .catch((err) => {
      console.log(axiosHandleError(err));
    });
};

export const getListingReviewsLoadmore = (id, next) => async (dispatch) => {
  try {
    const { data } = await axios.get(`listings/${id}/${item.key}`, {
      params: {
        postsPerPage: 5,
        page: next,
      },
    });
    const { aReviews, next: _next } = data.oResults;
    if (data.status === "success") {
      dispatch({
        type: types.GET_LISTING_REVIEWS_ALL_LOADMORE,
        payload: { aReviews, next: _next, id: `${id}_details` },
      });
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};

/**
 * GET LISTING DETAIL EVENTS
 * @param {*} id listing
 * @param {*} key = events
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingEvents = (id, item, max) => (dispatch) => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true,
  });
  return axios
    .get(`listings/${id}/${item.key}`, {
      params: {
        ...item,
        maximumItemsOnHome: max !== "" ? max : null,
      },
    })
    .then((res) => {
      console.log({ res });
      const payload =
        res.data.status === "success" ? res.data.oResults : "__empty__";
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_EVENTS,
          payload: { [`${id}_details`]: filterMax(payload)(2) },
        });
      } else {
        dispatch({
          type: types.GET_LISTING_EVENTS_ALL,
          payload: { [`${id}_details`]: payload },
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false,
        });
      }
    })
    .catch((err) => {
      dispatch({
        type: types.LOADING_LISTING_DETAIL,
        loading: false,
      });
      console.log("event", err);
    });
};

/**
 * GET_LISTING_BOX_CUSTOM
 * @param {*} id listing
 * @param {*} key = events
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingBoxCustom = (id, item, max, isLoading = false) => (
  dispatch
) => {
  return axios
    .get(`listings/${id}/${item.key}`, {
      params: {
        ...item,
        maximumItemsOnHome: max !== "" ? max : null,
      },
    })
    .then((res) => {
      const data =
        res.data.status === "success" ? res.data.oResults : "__empty__";
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_BOX_CUSTOM,
          payload: {
            data,
            key: item.key,
            id,
          },
        });
      } else {
        dispatch({
          type: types.GET_LISTING_BOX_CUSTOM_ALL,
          payload: {
            data,
            key: item.key,
            id,
          },
        });
      }
    })
    .catch((err) => {
      console.log(axiosHandleError(err));
      dispatch({
        type: types.GET_LISTING_BOX_CUSTOM,
        payload: {
          data: "__empty__",
          key,
          id: `${id}_details`,
        },
      });
    });
};

/**
 * GET LISTING DETAIL NAVIGATION
 * @param {*} data = oNavigation
 */
export const getListingDetailNavigation = (data) => (dispatch) => {
  dispatch({
    type: types.GET_LISTING_DETAIL_NAV,
    detailNav: data,
  });
};

/**
 * CHANGE LISTING DETAIL NAVIGATION
 * @param {*} key
 */
export const changeListingDetailNavigation = (key) => (dispatch) => {
  dispatch({
    type: types.CHANGE_LISTING_DETAIL_NAV,
    key,
  });
};

export const getListingSidebar = (listingId) => async dispatch => {
  dispatch({
    type: types.LISTING_DETAIL_SIDEBAR_REQUEST_TIMEOUT,
    isTimeout: false,
  });
  return axios
    .get(`listing/sidebar/${listingId}?lang=${await Obteneridioma()}`)
    .then((res) => {
      const payload =
        res.data.status === "success" ? res.data.oResults : "__empty__";
      dispatch({
        type: types.GET_LISTING_SIDEBAR,
        payload: { [`${listingId}_details`]: payload },
      });
      // dispatch({
      //   type: types.LISTING_DETAIL_SIDEBAR_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch((err) => {
      // dispatch({
      //   type: types.LISTING_DETAIL_SIDEBAR_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(axiosHandleError(err));
    });
};
export const getListingRestaurantMenu = (listingId, item) => async (
  dispatch
) => {
  try {
    const endpoint = `/listings/${listingId}/${item.key}`;
    const { data } = await axios.get(endpoint, {
      params: {
        ...item,
      },
    });
    const payload = data.status === "success" ? data.oResults : "__empty__";
    dispatch({
      type: types.GET_LISTING_RESTAURANT_MENU,
      payload: { [`${listingId}_details`]: payload },
    });
  } catch (err) {
    console.log("restaurant", err);
  }
};
export const getListingProducts = (id, item, max) => async (dispatch) => {
  try {
    const endpoint = `listings/${id}/${item.key}`;
    const { data } = await axios.get(endpoint, {
      params: {
        ...item,
        maximumItemsOnHome: max !== "" ? max : null,
      },
    });
    const payload = data.status === "success" ? data.oResults : "__empty__";
    if (max !== null) {
      dispatch({
        type: types.GET_LISTING_PRODUCTS,
        payload: { [`${id}_details`]: payload },
      });
    } else {
      dispatch({
        type: types.GET_LISTING_PRODUCTS_ALL,
        payload: { [`${id}_details`]: payload },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getListingCustomSection = (id, item) => async (dispatch) => {
  try {
    const endpoint = `listings/${id}/${item.key}`;
    const { data } = await axios.get(endpoint, {
      params: {
        ...item,
      },
    });
    const payload = data.status === "success" ? data.oResults : "__empty__";
    dispatch({
      type: types.LISTING_CUSTOM_SECTION,
      payload: {
        id,
        key: item.key,
        data: payload,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getListingTaxonomy = (id, item) => async dispatch => {
  try {
    const endpoint = `listings/${id}/${item.key}`;
    const { data } = await axios.get(endpoint, {
      params: {
        lang: await Obteneridioma(),
        ...item,
      },
    });
    const payload = data.status === "success" ? data.oResults : "__empty__";
    dispatch({
      type: types.LISTING_TAXONOMY,
      payload: {
        id,
        key: item.key,
        data: payload,
      },
    });
  } catch (err) {
    console.log("taxonomy", err.response);
  }
};

export const getListingCoupon = (id, item, max) => async (dispatch) => {
  try {
    const endpoint = `listings/${id}/${item.key}`;
    const { data } = await axios.get(endpoint, {
      params: {
        ...item,
      },
    });
    const payload = data.status === "success" ? data.oResults : "__empty__";
    dispatch({
      type: types.LISTING_COUPON,
      payload: {
        [`${id}_details`]: payload,
      },
    });
  } catch (err) {
    console.log("coupon", err);
  }
};
export const getListingAritcle = (id, item, max) => async (dispatch) => {
  try {
    const endpoint = `listings/${id}/${item.key}`;
    const { data } = await axios.get(endpoint, {
      params: {
        ...item,
        maximumItemsOnHome: max !== "" ? max : null,
      },
    });
    const payload = data.status === "success" ? data.oResults : "__empty__";

    if (max !== null) {
      dispatch({
        type: types.GET_LISTING_ARTICLE,
        payload: {
          [`${id}_details`]: payload,
        },
      });
    } else {
      dispatch({
        type: types.GET_LISTING_ARTICLE_ALL,
        payload: {
          [`${id}_details`]: payload,
        },
      });
    }
  } catch (err) {
    console.log("article", err);
  }
};
export const getListingProductAdvanced = (id, item, max = null) => async (
  dispatch
) => {
  try {
    const endpoint = `listings/${id}/${item.key}?cache_excludes=${item.key}`;
    const { data } = await axios.get(endpoint, {
      params: {
        ...item,
        maximumItemsOnHome: max,
      },
    });
    const payload = data.status === "success" ? data.oResults : "__empty__";
    if (item.variant === "single_selection") {
      dispatch({
        type: types.GET_LISTING_SINGLE_PRODUCT,
        payload: {
          [`${id}_details`]: payload,
        },
      });
    }
    if (item.variant === "multiple_selection") {
      dispatch({
        type: types.GET_LISTING_MULTIPLE_PRODUCT,
        payload: {
          [`${id}_details`]: payload,
        },
      });
    }
  } catch (err) {
    console.log("single product", err);
  }
};
export const addToCartListing = (params) => async (dispatch) => {
  const endpoint = "/wc/add-to-cart";
  try {
    const { data } = await axios.post(endpoint, {
      id: params.id,
      quantity: params.quantity || 1,
      mode: params.mode,
    });
    if (data.status === "success") {
      if (params.variant === "single_selection") {
        dispatch({
          type: types.ADD_TO_CART_LISTING,
          payload: {
            listingID: `${params.listingID}_details`,
            msg: data.msg,
            status: data.status,
            productID: params.id,
            cartKey: data.cartKey,
          },
        });
      }
    } else {
      Alert.alert(data.msg);
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: types.CHANGE_QUANTITY_LISTING,
      payload: {
        productID: params.id,
        listingID: `${params.listingID}_details`,
        quantity: 0,
      },
    });
    Alert.alert(err);
  }
};

export const removeToCartListing = (params) => async (dispatch) => {
  const endpoint = "/wc/remove-cart";
  try {
    console.log({ params });
    const { data } = await axios.post(endpoint, {
      key: params.cartKey,
    });
    if (data.status === "success") {
      dispatch({
        type: types.REMOVE_TO_CART_LISTING,
        payload: {
          listingID: `${params.listingID}_details`,
          productID: params.productID,
        },
      });
    } else {
      Alert.alert(data.msg);
    }
  } catch (err) {
    console.log("err", err);
  }
};

export const changeQuantityListing = (params) => async (dispatch) => {
  dispatch({
    type: types.CHANGE_QUANTITY_LISTING,
    payload: {
      productID: params.productID,
      quantity: params.quantity,
      listingID: `${params.listingID}_details`,
      type: params.type,
    },
  });
};

export const deductToCartListing = (params) => async (dispatch) => {
  try {
    const endpoint = "/wc/deduct-to-cart";
    const { data } = await axios.post(endpoint, {
      id: params.id,
      quantity: params.quantity || 1,
    });
    if (data.status === "success") {
      console.log({ data });
    } else {
      Alert.alert(data.msg);
    }
  } catch (err) {
    console.log(err);
    Alert.alert(err);
  }
};

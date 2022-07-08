import * as types from "../constants/actionTypes";
import _ from "lodash";

const reducers = (type) => (state = {}, action) => {
  switch (action.type) {
    case type:
      const obj = { ...state, ...action.payload };
      return objectRemoveFirstProps(obj, 100);
    case types.RESET_LISTING_DETAIL:
      return {};
    default:
      return state;
  }
};

const objectRemoveFirstProps = (data, num) => {
  const props = Object.keys(data);
  return props.reduce(
    (obj, key, index) => ({
      ...obj,
      ...(props.length > num && index === 0 ? {} : { [key]: data[key] }),
    }),
    {}
  );
};

export const listingDetail = reducers(types.GET_LISTING_DETAIL);
export const listingDescription = reducers(types.GET_LISTING_DESTINATION);
export const listingDescriptionAll = reducers(
  types.GET_LISTING_DESTINATION_ALL
);
export const listingListFeature = reducers(types.GET_LISTING_LIST_FEATURE);
export const listingListFeatureAll = reducers(
  types.GET_LISTING_LIST_FEATURE_ALL
);
export const listingVideos = reducers(types.GET_LISTING_VIDEOS);
export const listingVideosAll = reducers(types.GET_LISTING_VIDEOS_ALL);
export const listingProducts = reducers(types.GET_LISTING_PRODUCTS);
export const listingProductsAll = reducers(types.GET_LISTING_PRODUCTS_ALL);

export const listingArticle = reducers(types.GET_LISTING_ARTICLE);
export const listingArticleAll = reducers(types.GET_LISTING_ARTICLE_ALL);

export const listingCoupon = reducers(types.LISTING_COUPON);

const postReview = (state, action) => {
  const listingID = `${action.id}_details`;
  const reviewItems = _.get(state, `${listingID}.reviewItems`, []);
  if (_.isEmpty(reviewItems)) {
    return {
      ...state,
      [listingID]: {
        ...action.payload.oGeneral,
        total: 1,
        reviewItems: [action.payload.oItem],
      },
    };
  }
  return {
    ...state,
    [listingID]: {
      ...action.payload.oGeneral,
      total: action.payload.totalReviews + 1,
      reviewItems: reviewItems
        .map((item) => item.ID)
        .includes(action.payload.oItem.ID)
        ? reviewItems
        : [action.payload.oItem, ...reviewItems],
    },
  };
};

const putReview = (state, action) => {
  const listingID = `${action.id}_details`;
  const reviewItems = _.get(state, `${listingID}.reviewItems`, []);
  if (_.isEmpty(reviewItems)) return state;
  return {
    ...state,
    [listingID]: {
      ...state[listingID],
      ...action.payload.oGeneral,
      reviewItems: reviewItems.map((item) => ({
        ...(item.ID === action.payload.oItem.ID ? action.payload.oItem : item),
      })),
    },
  };
};

const deleteReview = (state, action) => {
  const listingID = `${action.id}_details`;
  const reviewItems = _.get(state, `${listingID}.reviewItems`, []);
  if (_.isEmpty(reviewItems)) return state;
  return {
    ...state,
    [listingID]: {
      ...action.payload.oGeneral,
      total: state[listingID].total === 0 ? 0 : action.payload.totalReviews - 1,
      reviewItems: reviewItems.filter(
        (item) => item.ID !== action.payload.reviewID
      ),
    },
  };
};

const likeReview = (state, action) => {
  const listingID = `${action.id}_details`;
  const reviewItems = _.get(state, `${listingID}.reviewItems`, []);
  if (_.isEmpty(reviewItems)) return state;
  return {
    ...state,
    [listingID]: {
      ...state[listingID],
      reviewItems: reviewItems.map((item) => {
        const { reviewID, isLiked, countLiked } = action.payload;
        return {
          ...item,
          countLiked: item.ID === reviewID ? countLiked : item.countLiked,
          isLiked: item.ID === reviewID ? isLiked : item.isLiked,
        };
      }),
    },
  };
};

const postCommentInReview = (state, action) => {
  const listingID = `${action.id}_details`;
  const reviewItems = _.get(state, `${listingID}.reviewItems`, []);

  if (_.isEmpty(reviewItems)) return state;
  return {
    ...state,
    [listingID]: {
      ...state[listingID],
      reviewItems: reviewItems.map((item) => {
        const { reviewID, oReview } = action.payload;
        const { countComments } = oReview;
        return {
          ...item,
          countDiscussions:
            item.ID === reviewID ? countComments : item.countDiscussions,
        };
      }),
    },
  };
};

const deleteCommentInReview = (state, action) => {
  const listingID = `${action.id}_details`;
  const reviewItems = _.get(state, `${listingID}.reviewItems`, []);
  if (_.isEmpty(reviewItems)) return state;
  return {
    ...state,
    [listingID]: {
      ...state[listingID],
      reviewItems: reviewItems.map((item) => {
        const { reviewID, countDiscussions } = action.payload;
        return {
          ...item,
          countDiscussions:
            item.ID === reviewID ? countDiscussions : item.countDiscussions,
        };
      }),
    },
  };
};

const shareCommentInReview = (state, action) => {
  const listingID = `${action.id}_details`;
  const reviewItems = _.get(state, `${listingID}.reviewItems`, []);

  if (_.isEmpty(reviewItems)) return state;
  return {
    ...state,
    [listingID]: {
      ...state[listingID],
      reviewItems: reviewItems.map((item) => {
        const { reviewID, countShared } = action.payload;
        return {
          ...item,
          countShared: item.ID === reviewID ? countShared : item.countShared,
        };
      }),
    },
  };
};

export const listingReviews = (state = [], action) => {
  switch (action.type) {
    case types.GET_LISTING_REVIEWS:
      const obj = { ...state, ...action.payload };
      return objectRemoveFirstProps(obj, 100);
    case types.POST_REVIEW:
      return postReview(state, action);
    case types.PUT_REVIEW:
      return putReview(state, action);
    case types.DELETE_REVIEW:
      return deleteReview(state, action);
    case types.LIKE_REVIEW:
      return likeReview(state, action);
    case types.POST_COMMENT_IN_REVIEWS:
      return postCommentInReview(state, action);
    case types.DELETE_COMMENT_IN_REVIEWS:
      return deleteCommentInReview(state, action);
    case types.SHARE_REVIEW:
      return shareCommentInReview(state, action);
    default:
      return state;
  }
};
export const listingReviewsAll = (state = [], action) => {
  switch (action.type) {
    case types.GET_LISTING_REVIEWS_ALL:
      const obj = { ...state, ...action.payload };
      return objectRemoveFirstProps(obj, 100);
    case types.POST_REVIEW:
      return postReview(state, action);
    case types.PUT_REVIEW:
      return putReview(state, action);
    case types.DELETE_REVIEW:
      return deleteReview(state, action);
    case types.LIKE_REVIEW:
      return likeReview(state, action);
    case types.POST_COMMENT_IN_REVIEWS:
      return postCommentInReview(state, action);
    case types.DELETE_COMMENT_IN_REVIEWS:
      return deleteCommentInReview(state, action);
    case types.SHARE_REVIEW:
      return shareCommentInReview(state, action);
    case types.GET_LISTING_REVIEWS_ALL_LOADMORE:
      const listingID = `${action.payload.id}_details`;
      return {
        ...state,
        [listingID]: {
          next: action.payload.next,
          reviewItems: [
            ...state[listingID].reviewItems,
            ...action.payload.reviewItems,
          ],
        },
      };
    default:
      return state;
  }
};
export const listingReviewError = (state = "", action) => {
  switch (action.type) {
    case types.POST_REVIEW_ERROR:
      return action.payload;
    default:
      return state;
  }
};

export const listingEvents = reducers(types.GET_LISTING_EVENTS);
export const listingEventsAll = reducers(types.GET_LISTING_EVENTS_ALL);

export const listingSidebar = reducers(types.GET_LISTING_SIDEBAR);

export const commentInReviews = (state = [], action) => {
  switch (action.type) {
    case types.GET_COMMENT_IN_REVIEWS:
      return action.payload;
    case types.POST_COMMENT_IN_REVIEWS:
      return [action.payload, ...state];
    case types.DELETE_COMMENT_IN_REVIEWS:
      return state.filter((item) => item.ID !== action.payload.commentID);
    case types.EDIT_COMMENT_IN_REVIEWS:
      return state.map((item) => ({
        ...item,
        postContent:
          item.ID === action.payload.commentID
            ? action.payload.content
            : item.postContent,
      }));
    case types.RESET_LISTING_DETAIL:
      return [];
    default:
      return state;
  }
};

export const listingPhotos = reducers(types.GET_LISTING_PHOTOS);
export const listingPhotosAll = reducers(types.GET_LISTING_PHOTOS_ALL);

export const listingDetailNav = (state = [], action) => {
  switch (action.type) {
    case types.GET_LISTING_DETAIL_NAV:
      return action.detailNav;
    case types.CHANGE_LISTING_DETAIL_NAV:
      return state.map((item) => {
        const condition = item.key === action.key;
        return {
          ...item,
          current: condition ? true : false,
          loaded: condition ? true : item.loaded,
        };
      });
    case types.RESET_LISTING_DETAIL:
      return [];
    default:
      return state;
  }
};

export const listingCustomBox = (state = [], action) => {
  switch (action.type) {
    case types.GET_LISTING_BOX_CUSTOM:
    case types.GET_LISTING_BOX_CUSTOM_ALL:
      const listingID = `${action.payload.id}_details`;
      const obj = {
        ...state,
        [listingID]: {
          ...state[listingID],
          [action.payload.key]:
            typeof action.payload.data === "object"
              ? action.payload.data
              : [action.payload.data],
        },
      };
      return objectRemoveFirstProps(obj, 100);

    case types.RESET_LISTING_DETAIL:
      return {};
    default:
      return state;
  }
};

export const listingCustomSection = (state = {}, action) => {
  switch (action.type) {
    case types.LISTING_CUSTOM_SECTION:
      const listingID = `${action.payload.id}_details`;
      const obj = {
        ...state,
        [listingID]: {
          ...state[listingID],
          [action.payload.key]: action.payload.data,
        },
      };
      return objectRemoveFirstProps(obj, 100);
    default:
      return state;
  }
};

export const listingTaxonomy = (state = {}, action) => {
  switch (action.type) {
    case types.LISTING_TAXONOMY:
      const listingID = `${action.payload.id}_details`;

      const obj = {
        ...state,
        [listingID]: {
          ...state[listingID],
          [action.payload.key]: action.payload.data,
        },
      };
      return objectRemoveFirstProps(obj, 100);
    default:
      return state;
  }
};

export const listingRestaurantMenu = reducers(
  types.GET_LISTING_RESTAURANT_MENU
);
export const listingAdvancedSingleProduct = (state = {}, action) => {
  switch (action.type) {
    case types.GET_LISTING_SINGLE_PRODUCT:
      const obj = { ...state, ...action.payload };
      return objectRemoveFirstProps(obj, 100);
    case types.ADD_TO_CART_LISTING:
      return {
        ...state,
        [action.payload.listingID]: state[action.payload.listingID].map(
          (i) => ({
            ...i,
            msg: action.payload.msg,
            products: i.products.map((e) => ({
              ...e,
              isAddedToCart:
                e.ID === action.payload.productID ? true : e.isAddedToCart,
              cartKey:
                e.ID === action.payload.productID
                  ? action.payload.cartKey
                  : false,
            })),
          })
        ),
      };
    case types.REMOVE_TO_CART_LISTING:
      return {
        ...state,
        [action.payload.listingID]: state[action.payload.listingID].map(
          (i) => ({
            ...i,
            products: i.products.map((e) => ({
              ...e,
              isAddedToCart:
                e.ID === action.payload.productID ? false : e.isAddedToCart,
            })),
          })
        ),
      };
    default:
      return state;
  }
};

export const listingAdvancedMultipleProducts = (state = {}, action) => {
  switch (action.type) {
    case types.GET_LISTING_MULTIPLE_PRODUCT:
      const obj = { ...state, ...action.payload };
      return objectRemoveFirstProps(obj, 100);
    case types.CHANGE_QUANTITY_LISTING:
      return {
        ...state,
        [action.payload.listingID]: state[action.payload.listingID].map(
          (i) => ({
            ...i,
            products: i.products.map((p) => ({
              ...p,
              quantity:
                p.ID === action.payload.productID
                  ? action.payload.type === "input"
                    ? action.payload.quantity
                    : p.quantity + action.payload.quantity
                  : p.quantity,
            })),
          })
        ),
      };
    default:
      return state;
  }
};

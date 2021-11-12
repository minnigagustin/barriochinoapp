const { GET_MY_REVIEW } = require("./actions");

const initialState = {
  isLoading: false,
  isLoadmore: true,
  data: [],
  next: 2,
  message: "",
};

const myReviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MY_REVIEW.REQUEST:
      if (action.payload.isLoadmore) {
        return {
          ...state,
          isLoadmore: true,
        };
      }
      return {
        isLoading: true,
      };
    case GET_MY_REVIEW.SUCCESS: {
      if (action.payload.isLoadmore) {
        return {
          isLoading: false,
          isLoadmore: false,
          next: action.payload.data.next,
          data: !!action.payload.data.next
            ? [...state.data, ...action.payload.data.aResults]
            : state.data,
        };
      }
      return {
        isLoading: false,
        next: action.payload.data.next,
        data: action.payload.data.aResults,
      };
    }
    case GET_MY_REVIEW.FAILURE: {
      if (action.payload.isLoadmore) {
        return {
          isLoading: false,
          isLoadmore: false,
          message: "",
        };
      }
      return {
        isLoading: false,
        message: "Error",
      };
    }
    default:
      return state;
  }
};

export default myReviewReducer;

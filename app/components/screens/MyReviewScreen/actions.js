import axios from "axios";

export const GET_MY_REVIEW = {
  REQUEST: "GET_MY_REVIEW/REQUEST",
  SUCCESS: "GET_MY_REVIEW/SUCCESS",
  FAILURE: "GET_MY_REVIEW/FAILURE",
};

const getMyReviews = ({ next = 1, isLoadmore = false } = {}) => async (
  dispatch
) => {
  dispatch({ type: GET_MY_REVIEW.REQUEST, payload: { isLoadmore } });
  try {
    const res = await axios.get("me/reviews", {
      params: { postsPerPage: 12, page: next },
    });
    dispatch({
      type: GET_MY_REVIEW.SUCCESS,
      payload: { data: res.data, isLoadmore },
    });
  } catch (err) {
    console.log(err.response);
    dispatch({ type: GET_MY_REVIEW.FAILURE, payload: { isLoadmore } });
  }
};

export default getMyReviews;

import { csrfFetch } from './csrf';

// Action Type Constants
export const GET_ALL_REVIEWS_BY_SPOTID = 'reviews/GET_ALL_REVIEWS_BY_SPOTID'

// Action Creators
export const getAllReviewsBySpotIdAction = (reviews) => ({
  type: GET_ALL_REVIEWS_BY_SPOTID,
  reviews
});

// Thunk Action Creators
export const getAllReviewsBySpotIdThunk = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`)
  if (res.ok) {
    const newRes = await res.json();
    await dispatch(getAllReviewsBySpotIdAction(newRes))
  }
}

// reducer
const initialState = {spot: {}};
const reviewReducer = (state = initialState, action) => {
  let newState;
  switch(action.type) {
    case GET_ALL_REVIEWS_BY_SPOTID: {
      newState = {spot: {...state.spot}}
      action.reviews.Reviews.forEach(review => {
        newState.spot[review.id] = review
      })

      return newState;
    }

    default: return state;
  }
};

export default reviewReducer;
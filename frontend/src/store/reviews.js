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
  const res = await fetch('/api/')
}
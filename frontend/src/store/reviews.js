import { csrfFetch } from './csrf';

// Action Type Constants
export const GET_ALL_REVIEWS_BY_SPOTID = 'reviews/GET_ALL_REVIEWS_BY_SPOTID'

// Action Creators
export const getAllReviewsBySpotIdAction = (reviewsOfThisSpot) => ({
  type: GET_ALL_REVIEWS_BY_SPOTID,
  reviewsOfThisSpot
});

// Thunk Action Creators
export const getAllReviewsBySpotIdThunk = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`)   // this is where frontend asks backend to get all the reviews of this spotId for us.
  if (res.ok) {                                             // this is called res cuz it's the response/result of this fetch.
    const newRes = await res.json();                        // newRes is everything ur backend gave u for this route
    await dispatch(getAllReviewsBySpotIdAction(newRes))
  }
}

// reducer
const initialState = {spot: {}, user: {}};                  // u need to look at the structure img to see what empty stuff to put here, this is for reviews.
const reviewReducer = (state = initialState, action) => {
  let newState;
  switch(action.type) {
    case GET_ALL_REVIEWS_BY_SPOTID: {
      newState = {...state, spot: {}}                               // first spread in  old empty initial state (shopping cart A), then declare spot as empty for shopping Cart B reference in memory.  Cart B is the one to be filled, so it'll look diff than empty Cart A initial style.
      action.reviewsOfThisSpot.Reviews.forEach(review => {          // action.reviewsOfThisSpot this is the package we receive from fetch.  we key into the Reviews key box we gave in res.json in backend.  inside is an array of review objects of this spot.
        newState.spot[review.id] = review                           // makes newState: reviews: spot: => {1: {id:1, ...}, 4: {id:4, ...}}
      })

      return newState;
    }

    default: return state;
  }
};

export default reviewReducer;
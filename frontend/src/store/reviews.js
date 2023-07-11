import { csrfFetch } from './csrf';

// Action Type Constants
export const GET_ALL_REVIEWS_BY_SPOTID = 'reviews/GET_ALL_REVIEWS_BY_SPOTID';
export const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
export const EDIT_REVIEW = 'reviews/EDIT_REVIEW';
export const DELETE_REVIEW = 'reviews/DELETE_REVIEW';


// Action Creators
export const getAllReviewsBySpotIdAction = (reviewsOfThisSpot) => ({
  type: GET_ALL_REVIEWS_BY_SPOTID,
  reviewsOfThisSpot
});

// how to know what to write in variable:
// what am i gonna write in the thunk, like what's it gonna do
// u need to ask for info and give it an argument or something and send it to back, so it can fulfill the order
// before writing ur action, u have to write ur thunk, but u gotta start at ur component first.


// for create: i'm at the big page called get spot details by id.  (i'm not the owner of a review yet)
// how to determine what goes in the argument for action:
// look at the successful response of api doc of create review
// then pass it in
export const createReviewAction = (newReview) => ({        
  type: CREATE_REVIEW,
  newReview
})

export const deleteReviewAction = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId
})


// Thunk Action Creators
export const getAllReviewsBySpotIdThunk = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`)   // this is where frontend asks backend to get all the reviews of this spotId for us.
  if (res.ok) {                                             // this is called res cuz it's the response/result of this fetch.
    const newRes = await res.json();                        // newRes is everything ur backend gave u for this route
    await dispatch(getAllReviewsBySpotIdAction(newRes))
  }
}

export const createReviewThunk = (spotId, newReviewObj) => async (dispatch) => {    // newReviewObj is what the user sends {review, stars}
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newReviewObj)
  }); 
  if (res.ok) {
    const newReview = await res.json()       // look at api doc to see the good result of res for structure idea, it's the completed fetched from backend response jsoned.
    await dispatch(createReviewAction(newReview))
  }
}

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'            // since this is delete, no need head or body
  });
  if (res.ok) {
    await dispatch(deleteReviewAction(reviewId))
  }
}



// reducer
// reducer is always listening for a dispatch of action
const initialState = {spot: {}, user: {}};                  // u need to look at the structure img to see what empty stuff to put here, this is for reviews.
const reviewReducer = (state = initialState, action) => {
  let newState;
  switch(action.type) {
    case GET_ALL_REVIEWS_BY_SPOTID: {                                 // IN LINE 67, SPOT: {} DOESN'T NEED A SPREAD INSIDE CUZ IT'S JUST FETCHING DATA AND PREV STATE NEEDS TO BE ALWAYS EMPTY BEFORE
      newState = {...state, spot: {}}                               // first spread in  old empty initial state (shopping cart A), then declare spot as empty for shopping Cart B reference in memory.  Cart B is the one to be filled, so it'll look diff than empty Cart A initial style.
      action.reviewsOfThisSpot.Reviews.forEach(review => {          // action.reviewsOfThisSpot this is the package we receive from fetch.  we key into the Reviews key box we gave in res.json in backend.  inside is an array of review objects of this spot.
        newState.spot[review.id] = review                           // makes newState: reviews: spot: => {1: {id:1, ...}, 4: {id:4, ...}}
      })

      return newState;
    }
    case CREATE_REVIEW: {                                           // since we adding onto the old data, we gotta spread in the old data first
      newState = {...state, spot: {...state.spot}}                  // we use the word spot cuz of the img structure picture.  
      newState.spot[action.newReview.id] = action.newReview;            // U NEEEDDDD TO SPREAD STATE.SPOT ON LINE 75 OR ELSE IT'LL REPLACE ALL EXISTING REVIEWS ON SPOT PAGE WITH UR NEW REVIEW, UNTIL REFRESH.  PREV STATE IS NOT ALWAYS EMPTY.
      return newState;
    }
    case DELETE_REVIEW: {
      newState = {...state, spot: {...state.spot}}
      delete newState.spot[action.reviewId];
      return newState;
    }

    default: return state;
  }
};

export default reviewReducer;
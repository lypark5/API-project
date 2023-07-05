import { csrfFetch } from './csrf'      // special fetch for validating authorized.

// Action Type Constants
export const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS'  // action name
export const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS'

// Action Creators
export const getAllSpotsAction = (spots) => ({
  type: GET_ALL_SPOTS,
  spots
});

export const getSpotDetailsAction = (spot) => ({
  type: GET_SPOT_DETAILS,
  spot
});

// Thunk Action Creators
// create thunk: request info from backend, sends it to front, thunks should be async
export const getAllSpotsThunk = () => async (dispatch) => {
  const res = await fetch('/api/spots')             // this is the backend home page for /spots
  if (res.ok) {
    const newRes = await res.json();
    dispatch(getAllSpotsAction(newRes)) ;  // invoking the action.  newRes = spots on line 2
    return newRes;   
  }
}

export const getSpotDetailsThunk = (spotId) => async (dispatch) => {
  let res = await fetch(`/api/spots/${spotId}`)
  if (res.ok) {
    let newRes = await res.json()
    await dispatch(getSpotDetailsAction(newRes))
  }
}

const initialState = {allSpots: {}, singleSpot: {}};  // look at wiki
const spotReducer = (state = initialState, action) => {
  let newState;
  switch(action.type) {
    case GET_ALL_SPOTS: {
      newState = {allSpots: {...state.allSpots}, singleSpot: {}}
      // console.log('action.spots.Spots = ', action.spots.Spots)       // vs. action.spots
      action.spots.Spots.forEach(spot => {
        newState.allSpots[spot.id] = spot
      })

      return newState;
    }
    case GET_SPOT_DETAILS: {
      newState = {allSpots: {}, singleSpot: {...state.singleSpot}}
      console.log('action.spot = ', action.spot)
      const spot = action.spot
      newState.singleSpot = spot
      return newState;
    }

    
    default: return state;
  }
};


export default spotReducer;

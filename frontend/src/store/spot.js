import { csrfFetch } from './csrf'      // special fetch for validating authorized.

const GET_ALL_SPOTS = 'getAllSpots'  // action name
const GET_ALL_SPOTS_ACTION = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots
  }
}

const GET_SPOT_DETAILS = 'getSpotDetails'
const GET_SPOT_DETAILS_ACTION = (spot) => {
  return {
    type: GET_SPOT_DETAILS,
    spot
  }
}

// create thunk: request info from backend, sends it to front, thunks should be async
export const GetAllSpotsThunk = () => async (dispatch) => {
  let res = await fetch('/api/spots')             // this is the backend home page for /spots
  if (res.ok) {
    let newRes = await res.json()
    await dispatch(GET_ALL_SPOTS_ACTION(newRes))    // invoking the action.  newRes = spots on line 2
  }
}

export const GetSpotDetailThunk = (spotId) => async (dispatch) => {
  let res = await fetch(`/api/spots/${spotId}`)
  if (res.ok) {
    let newRes = await res.json()
    await dispatch(GET_SPOT_DETAILS_ACTION(newRes))
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

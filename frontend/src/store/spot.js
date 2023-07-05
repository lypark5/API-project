const GET_ALL_SPOTS = 'getAllSpots'  // action name
const GET_ALL_SPOTS_ACTION = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots
  }
}

// create thunk: request info from backend, sends it to front
export const GetAllSpotsThunk = () => async (dispatch) => {
  let res = await fetch('/api/spots')             // this is the backend home page for /spots
  if (res.ok) {
    let newRes = await res.json()
    await dispatch(GET_ALL_SPOTS_ACTION(newRes))    // invoking the action.  newRes = spots on line 2
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
    default: return state;
  }
};

export default spotReducer;

import { csrfFetch } from './csrf'      // special fetch for validating authorized.


// Action Type Constants
export const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';  // action name
export const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';
export const CREATE_SPOT = 'spots/CREATE_SPOT';


// Action Creators
export const getAllSpotsAction = (spots) => ({
  type: GET_ALL_SPOTS,
  spots
});

export const getSpotDetailsAction = (spot) => ({
  type: GET_SPOT_DETAILS,
  spot
});

export const createSpotAction = (spot) => ({
  type: CREATE_SPOT,
  spot
})


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
  const res = await fetch(`/api/spots/${spotId}`)
  if (res.ok) {
    const newRes = await res.json()
    await dispatch(getSpotDetailsAction(newRes))
  }
}

export const createSpotThunk = (spot) => async (dispatch) => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(spot)
  });
  const newSpot = await res.json();  // PASS NEWSPOT IN TO THE OTHER THUNK?
    // NEED NEW IMG FETCH HERE
  if (res.ok) {
    dispatch(createSpotAction(newSpot));
    return newSpot;
  } else return newSpot;
}



// reducer
const initialState = {allSpots: {}, singleSpot: {}};  // look at wiki
const spotReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_ALL_SPOTS: {
      const newState = {allSpots: {...state.allSpots}, singleSpot: {}}    // ...state.allSpots is old stuff spreading to new stuff, this is declaring without deep copying
      console.log('action.spots.Spots = ', action.spots.Spots)       // [7 array]
      console.log('action.spots = ', action.spots)    // {Spots: [7 array]}
      action.spots.Spots.forEach(spot => {
        newState.allSpots[spot.id] = spot
      })

      return newState;
    }
    case GET_SPOT_DETAILS: {
      const newState = {allSpots: {}, singleSpot: {...state.singleSpot}}
      console.log('action.spot = ', action.spot)
      const spot = action.spot
      newState.singleSpot = spot
      return newState;
    }
    case CREATE_SPOT: {
      const newState = {allSpots: {...state.allSpots}, singleSpot: {}}
      const spots = action.spots
      newState.allSpots = spots
      return newState;
    }

    
    default: return state;
  }
};


export default spotReducer;

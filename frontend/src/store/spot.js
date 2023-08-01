import { csrfFetch } from './csrf'      // special fetch for validating authorized.


// Action Type Constants
export const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';  // action name
export const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';
export const CREATE_SPOT = 'spots/CREATE_SPOT';
export const DELETE_SPOT = 'spots/DELETE_SPOT';
export const EDIT_SPOT = 'spots/EDIT_SPOT';


// Action Creators
export const getAllSpotsAction = (spots) => ({
  type: GET_ALL_SPOTS,
  spots
});

export const getSpotDetailsAction = (spot) => ({
  type: GET_SPOT_DETAILS,
  spot
});

// export const createSpotAction = (spot) => ({
//   type: CREATE_SPOT,
//   spot
// });

export const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId
});

export const editSpotAction = (spot) => ({
  type: EDIT_SPOT,
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
  const res = await fetch(`/api/spots/${spotId}`)
  if (res.ok) {
    const newRes = await res.json()
    await dispatch(getSpotDetailsAction(newRes))            // 
  }
}

export const createSpotThunk = (spot, urls) => async (dispatch) => {      // spots is the create spot data the user put in, urls is the urlArr 
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(spot)
  });

  if (res.ok) {
    const newSpot = await res.json();  // PASS NEWSPOT IN TO THE OTHER THUNK?
    for (let url of urls) {                                               // iterating thru each url
      await csrfFetch(`/api/spots/${newSpot.id}/images`, {
        method: 'POST',                                                   // post req for each url
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(url)
      }); 
    }
    return newSpot;
  } else return res.errors;                                       // this displays backend errors?  maybe
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  })
  if (res.ok) {
    await dispatch(deleteSpotAction(spotId))
  }
}

export const editSpotThunk = (spot, spotId) => async (dispatch) => {    //getSpotDetailsThunk is called in a dispatch in get spot detail page
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(spot)        // body comes from component, not action
  });                                                                 // don't need res.ok ish, cuz it's getting redirected to details page.
}



// reducer
// reducer basically changes the state, and also decides the structure of the state
const initialState = {allSpots: {}, singleSpot: {}};  // look at wiki
const spotReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_ALL_SPOTS: {
      const newState = {allSpots: {...state.allSpots}, singleSpot: {}}    // ...state.allSpots is old stuff spreading to new stuff, this is declaring without deep copying
      console.log('action.spots.Spots = ', action.spots.Spots)       // [7 array]
      console.log('action.spots = ', action.spots)    // {Spots: [7 array]}.  u must look at successful res of api doc
      action.spots.Spots.forEach(spot => {            // this and next line is normalization.
        newState.allSpots[spot.id] = spot             // for each result =>     newState = {allSpots: {1:{}, 2:{}, 3:{}}}
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

    // case CREATE_SPOT: {                                                     // we don't need create action or create reducer cuz the res of get spot details has more info than create spot, it'll error out cuz don't match.
    //   const newState = {allSpots: {...state.allSpots}, singleSpot: {}}
    //   const spots = action.spots
    //   newState.allSpots = spots
    //   return newState;
    // }

    case DELETE_SPOT: {
      const newState = {allSpots: {...state.allSpots}, singleSpot: {}}
      delete newState.allSpots[action.spotId]
      return newState;
    }

    default: return state;
  }
};


export default spotReducer;

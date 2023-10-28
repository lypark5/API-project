import { csrfFetch } from './csrf';


// Action Type Constants
export const GET_ALL_BOOKINGS_BY_SPOTID = 'bookings/GET_ALL_BOOKINGS_BY_SPOTID';
export const GET_ALL_BOOKINGS_BY_USER = '/bookings/GET_ALL_BOOKINGS_BY_USER';
export const CREATE_BOOKING = '/bookings/CREATE_BOOKING';
export const EDIT_BOOKING = '/bookings/EDIT_BOOKING';
export const DELETE_BOOKING = '/bookings/DELETE_BOOKING';


// Action Creators
export const getAllBookingsBySpotIdAction = (bookingsOfThisSpot) => ({
  type: GET_ALL_BOOKINGS_BY_SPOTID,
  bookingsOfThisSpot
});

export const getAllBookingsByUserAction = (bookingsOfUser) => ({
  type: GET_ALL_BOOKINGS_BY_USER,
  bookingsOfUser
});

export const createBookingAction = (newBooking) => ({
  type: CREATE_BOOKING,
  newBooking
});

export const editBookingAction = (editedBooking) => ({
  type: EDIT_BOOKING,
  editedBooking
});

export const deleteBookingAction = (bookingId) => ({
  type: DELETE_BOOKING,
  bookingId
});


// Thunk Action Creators
export const getAllBookingsBySpotIdThunk = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/bookings`)
  if (res.ok) {
    const newRes = await res.json();
    await dispatch(getAllBookingsBySpotIdAction(newRes))
    // return newRes;
  }
}

export const getAllBookingsByUserThunk = (userId) => async (dispatch) => {
  const res = await csrfFetch('/api/bookings/current');
  if (res.ok) {
    const newRes = await res.json();
    await dispatch(getAllBookingsByUserAction(newRes));
  }
}

export const createBookingThunk = (spotId, startDate, endDate) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({startDate, endDate})
  })
  if (res.ok) {
    const newRes = await res.json();
    await dispatch(createBookingAction(newRes));
    return newRes;
  } else {
    return res;
  }
}

// export const editBookingThunk = (bookingId, editedBookingObj) => async (dispatch) => {
  export const editBookingThunk = (bookingId, startDate, endDate) => async (dispatch) => {
  const res = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    // body: JSON.stringify(editedBookingObj) 
    body: JSON.stringify({startDate, endDate})
  });
  if (res.ok) {
    const editedBooking = await res.json();
    await dispatch(editBookingAction(editedBooking));
    console.log('edited bookingggggg', editedBooking)
    return editedBooking;
    // await dispatch(getAllBookingsBySpotIdThunk(editedBooking.spotId));
    // await dispatch(getAllBookingsByUserThunk())
  } else {
    console.log('bad resssss', res)
    return res;
  }
}

export const deleteBookingThunk = (bookingId) => async (dispatch) => {
  const res = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    await dispatch(deleteBookingAction(bookingId))
  } else {
    return res.message;
  }
}


// reducer
const initialState = {spotBookings: {}, userBookings: {}};
const bookingReducer = (state = initialState, action) => {
  let newState;
  switch(action.type) {
    case GET_ALL_BOOKINGS_BY_SPOTID: {
      newState = {...state, spotBookings: {}};
      newState.spotBookings = action.bookingsOfThisSpot.Bookings
      return newState;
    }
    case GET_ALL_BOOKINGS_BY_USER: {
      newState = {...state, userBookings: {}};
      newState.userBookings = action.bookingsOfUser.Bookings
      return newState;
    }
    case CREATE_BOOKING: {
      newState = {...state, spotBookings: {...state.spotBookings}, userBookings: {...state.userBookings}};
      // newState.spotBookings = {...state.spotBookings, [action.newBooking.id]: action.newBooking};
      // newState.userBookings = {...state.userBookings, [action.newBooking.id]: action.newBooking};
      newState.spotBookings = {...state.spotBookings, [action.newBooking.id]: action.newBooking};
      newState.userBookings = {...state.userBookings, [action.newBooking.id]: action.newBooking};
      return newState;
    }
    case EDIT_BOOKING: {
      newState = {...state, spotBookings: {...state.spotBookings}, userBookings: {...state.userBookings}};
      newState.spotBookings = {...state.spotBookings, [action.editedBooking.id]: action.editedBooking};
      newState.userBookings = {...state.userBookings, [action.editedBooking.id]: action.editedBooking};
      return newState;
    }
    case DELETE_BOOKING: {
      newState = {...state, spotBookings: {...state.spotBookings}, userBookings: {...state.userBookings}};
      delete newState.spotBookings[action.bookingId];
      delete newState.userBookings[action.bookingId];
      return newState;
    }

    default: return state;
  }
};

export default bookingReducer;
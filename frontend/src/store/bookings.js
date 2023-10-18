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
    // await dispatch(getAllBookingsBySpotIdAction(newRes))
    return newRes;
  }
}

export const getAllBookingsByUserThunk = () => async (dispatch) => {
  const res = await csrfFetch('/api/bookings/current');
  if (res.ok) {
    const newRes = await res.json();
    await dispatch(getAllBookingsByUserAction(newRes));
  }
}

// export const createBookingThunk = (spotId, )
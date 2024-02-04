import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import { getAllBookingsBySpotIdThunk, createBookingThunk, getAllBookingsByUserThunk } from "../../../store/bookings";
import { useHistory } from 'react-router-dom';
import OpenModalButton from '../../OpenModalButton';
import './CreateBookingModal.css';


function CreateBookingFunction ({spotId}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const allSpotBookings = useSelector(state => state.bookings.spotBookings);
  const spotBookingsArr = Object.values(allSpotBookings);
  const allSpots = useSelector(state => state.spots.allSpots);
  const spotsArr = Object.values(allSpots);
  const userId = useSelector(state => state.session.user?.id);        // need the ? in case there is no user
  const [startDate, setStartDate] = useState('');     
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState({});
  let allBookings;


  useEffect(() => {
    dispatch(getAllBookingsBySpotIdThunk(spotId))
    spotBookingsArr.forEach(booking => {
      booking['Spot'] =  spotsArr.find(spot => spot.id === booking.spotId)
    })
  }, []);

  // console.log('new Date()', new Date())   // Thu Oct 26 2023 20:31:21 GMT-0500
  // console.log('new Date().toISOString().split("T")[0]', new Date().toISOString().split("T")[0])         // 2023-10-27

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createBookingThunk(spotId, startDate, endDate));
      await dispatch(getAllBookingsByUserThunk(userId));
      closeModal();
      history.push('/manage/bookings');
    }
    catch (e) {                   // e stands for error
      const errors = await e.json();
      if (errors.hasOwnProperty('errors')) setErrors(errors.errors);
      else setErrors(errors);


      // console.log('errors', errors)
      // setErrors(errors.errors);
      // console.log('errors2', errors)
    }
  }

  return userId ?  (
    <div className='modal' id='create-booking-modal'> 
      <h1>Book your stay</h1>
      <form onSubmit={handleSubmit} id='create-booking-form'>
        <div id='date-inputs-div'>
          <input
            className='date-input'
            type='date'
            value={startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setStartDate(e.target.value)}
          >
          </input>          
          <input
            className='date-input'
            type='date'
            value={endDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setEndDate(e.target.value)}
          >
          </input>
        </div>
        <div>
          {errors.startDate && <p className='errors'>{errors.startDate}</p>}
          {errors.endDate && <p className='errors'>{errors.endDate}</p>}
          {errors.message && <p className='errors'>{errors.message}</p>}



        </div>
        <button type='submit' className='booking-button'>Submit</button>
      </form>
    </div>
  ) : <h1>You must be logged in.</h1>
}



export default CreateBookingFunction
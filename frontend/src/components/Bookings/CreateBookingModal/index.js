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
  const userId = useSelector(state => state.session.user.id);
  const [startDate, setStartDate] = useState('');     
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState({});
  let allBookings;

  useEffect(() => {
    dispatch(getAllBookingsBySpotIdThunk(spotId))
  }, []);


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
      setErrors(errors.errors);
    }
  }

  return (
    <div className='modal' id='create-booking-modal'>
      <h1>Book your stay</h1>
      <form onSubmit={handleSubmit} id='create-booking-form'>
        <div id='date-inputs-div'>
          <input
            className='date-input'
            type='date'
            value={startDate}
            // min={Date.now()}
            onChange={(e) => setStartDate(e.target.value)}
          >
          </input>          
          <input
            className='date-input'
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          >
          </input>
        </div>
        <div>
          {errors.startDate && <p className='errors'>{errors.startDate}</p>}
          {errors.endDate && <p className='errors'>{errors.endDate}</p>}
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default CreateBookingFunction
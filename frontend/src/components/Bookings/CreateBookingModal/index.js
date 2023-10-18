import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import { getAllBookingsBySpotIdThunk, createBookingThunk } from "../../../store/bookings";
import OpenModalButton from '../../OpenModalButton';


function CreateBookingFunction ({spotId}) {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(Date.now());

  useEffect(() => {
    dispatch(getAllBookingsBySpotIdThunk(spotId))
  }, []);

  return (
    <div className='modal'>
      <h1>{`${startDate}`}</h1>
      <input
        id='start'
        type='date'
        min='2023-10-18'
      >
      </input>
      <input
        id='end'
        type='date'>
      </input>
      
    </div>
  )
}

export default CreateBookingFunction
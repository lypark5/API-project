import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import { useHistory } from 'react-router-dom';
import { editBookingThunk, getAllBookingsByUserThunk } from "../../../store/bookings";
import './EditBookingModal.css';


function EditBookingModalFunction({booking}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  // const bookingBeingEdited = useSelector(state => state.bookings.userBookings[booking.id]);
  const userId = useSelector(state => state.session.user.id);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState({});

  console.log('bookinggggg', booking)

  // function convertDate(date) {
  //   const sliced = date.slice(0,10)
  // }

  useEffect(() => {
    setStartDate(booking.startDate.slice(0, 10));     // = 2023-05-30, works for prefill
    setEndDate(booking.endDate.slice(0, 10));
    dispatch(getAllBookingsByUserThunk(userId));
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const editedBookingObj = {startDate, endDate};
      await dispatch (editBookingThunk(booking.id, startDate, endDate));
      await dispatch(getAllBookingsByUserThunk(userId));
      closeModal();
      history.push('/manage/bookings');
    } 
    catch (e) {                   // e stands for error
      const errors = await e.json();
      console.log('errrorrsss before', errors)
      if (errors.hasOwnProperty('errors')) setErrors(errors.errors);
      else setErrors(errors);
      console.log('errrorrsss after', errors)
    }
  }


  return (
    <div className='modal' id='edit-booking-modal'>
      <h2>Update your booking</h2>
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
        <button type='submit' className="booking-button">Submit</button>
      </form>
    </div>
  )
}



export default EditBookingModalFunction
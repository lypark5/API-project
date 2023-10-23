import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useModal } from "../../../context/Modal";
import { deleteBookingThunk, getAllBookingsByUserThunk } from "../../../store/bookings";


function DeleteBookingModalFunction({bookingId}) {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.session.user.id);
  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});

  async function yesDeleteBookingFunction() {
    try {
      await dispatch(deleteBookingThunk(bookingId));
      await dispatch(getAllBookingsByUserThunk(userId));
      closeModal();
    }
    catch (e) {
      const errors = await e.json();
      console.log('errrorrssss in delete booking', errors)
      setErrors(errors);
    }  
  }


  return (
    <div className="modal delete-modal">
      <h3 style={{margin:'15px 0px 0px'}}>Confirm Delete</h3>
      <p style={{marginTop: '7px'}}>Are you sure you want to delete this booking?</p>
      <button onClick={() => yesDeleteBookingFunction()} className="red-button">Yes (Delete Booking)</button>
      <button onClick={() => closeModal()} className="no-button">No (Keep Booking)</button>
      <div>
        {errors.message && <p className='errors'>{errors.message}</p>}
      </div>
    </div>
  )
}


export default DeleteBookingModalFunction;
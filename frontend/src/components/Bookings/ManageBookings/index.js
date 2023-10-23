import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllSpotsThunk } from "../../../store/spot";
import { getAllBookingsByUserThunk } from "../../../store/bookings";
import DeleteBookingModalFunction from "../DeleteBookingModal";
import OpenModalButton from "../../OpenModalButton";



function ManageBookingsFunction () {
  const dispatch = useDispatch();
  const bookingsOfUser = useSelector(state => state.bookings.userBookings)
  const bookingsArr = Object.values(bookingsOfUser);
  const allSpots = useSelector(state => state.spots.allSpots);
  const spotsArr = Object.values(allSpots);


  useEffect(() => {
    dispatch(getAllSpotsThunk())
    dispatch(getAllBookingsByUserThunk())
  }, [])

  //bookings state already has Spot object attribute attached
  function convertDate(date) {
    const cleanDate = date.split('T')[0].split('-')
    const year = cleanDate[0];
    const monthNum = cleanDate[1];
    const dateNum = cleanDate[2];
    return (<p>{monthNum}/{dateNum}/{year}</p>)
  }

  return (
    <div>
      <div>
        <h2>Manage Your Bookings</h2>
      </div>
      <div>
        {bookingsArr.length ? bookingsArr.map(booking =>
          <span>
            <h3>{booking.Spot.name}</h3>
            <img src={booking.Spot.previewImage} alt={booking.Spot.name} />
            <div id='bookings-bottom-half'>
              <div id='booking-dates-div'>
                {convertDate(booking.startDate)} - {convertDate(booking.endDate)}
              </div>
              <div id='bookings-buttons-div'>
                <button>edit</button>
                <OpenModalButton
                  className='update-or-delete'
                  buttonText='Delete'
                  modalComponent={<DeleteBookingModalFunction bookingId={booking.id}/>}
                />
              </div>
            </div>
          </span>
        ) 
        :
        <div>
          <p>No bookings yet</p>
        </div>
        }
      </div>
    </div>
  )
}

export default ManageBookingsFunction
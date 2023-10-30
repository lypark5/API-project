import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllSpotsThunk } from "../../../store/spot";
import { getAllBookingsByUserThunk } from "../../../store/bookings";
import EditBookingModalFunction from "../EditBookingModal";
import DeleteBookingModalFunction from "../DeleteBookingModal";
import OpenModalButton from "../../OpenModalButton";
import './ManageBookings.css';



function ManageBookingsFunction () {
  const dispatch = useDispatch();
  const bookingsOfUser = useSelector(state => state.bookings.userBookings)
  const bookingsArr = Object.values(bookingsOfUser);
  const allSpots = useSelector(state => state.spots.allSpots);
  const spotsArr = Object.values(allSpots);
  const userId = useSelector(state => state.session.user.id);

  useEffect(() => {
    dispatch(getAllSpotsThunk())
    dispatch(getAllBookingsByUserThunk(userId))
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
    <div className='manage-container-container'>
      <div id='booking-meat'>
        <div id='booking-title-div'>
          <h2 style={{marginBottom: '0px'}}>Manage Your Bookings</h2>
        </div>
        <div id='booking-card-container'>
          {bookingsArr.length ? bookingsArr.map(booking =>
            
            <div key={booking.id} id='booking-card'>
              <h3>{booking.Spot.name}</h3>
              <img src={booking.Spot.previewImage} alt={booking.Spot.name} id='booking-pic'/>
              <div id='bookings-bottom-half'>
                <div id='booking-dates-div'>
                  {convertDate(booking.startDate)} &nbsp; - &nbsp; {convertDate(booking.endDate)}
                </div>
                <div id='booking-buttons-div'>
                  <OpenModalButton
                    className='update-or-delete'
                    buttonText='Edit'
                    modalComponent={<EditBookingModalFunction booking={booking} />}
                  />
                  <OpenModalButton
                    className='update-or-delete'
                    buttonText='Delete'
                    modalComponent={<DeleteBookingModalFunction bookingId={booking.id} />}
                  />
                </div>
              </div>
            </div>
          ) 
          :
          <div>
            <p>No bookings yet</p>
          </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ManageBookingsFunction
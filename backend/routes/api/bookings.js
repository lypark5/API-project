// Instantiate router 
const express = require('express');
const router = express.Router();

// Import model(s)
const { Booking, Spot, SpotImage, User } = require('../../db/models');   // include the models we'll need.
// const { Op } = require('sequelize');       // only need to use this if u gonna use like comparers like Op.lte later
const { requireAuth } = require('../../utils/auth');          // import the middlewares.

// first gotta import bookings in 1) api/index.js, then 2) app.js √√



// GET ALL BOOKINGS BY CURRENT USER************************************************
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;                                 // destructuring/extracting user key from req, and naming it

  // finding all the bookings made by current
  const bookingsOfUser = await Booking.findAll({        // for every findAll, you need to iterate thru each one to json it
    where: {userId: user.id},    
    include: [
      {
        model: Spot,
        include: [{model: SpotImage, attributes: [ 'url', 'preview' ]}]
      }
    ]
  });
  // up to here returns big objects of bookings, now gotta tweak

  // for every findAll, you need to iterate thru each one to json it
  let bookingsList = [];
  for (let booking of bookingsOfUser) {
    bookingsList.push(booking.toJSON())                // this makes each review object json'ed.  u only json stuff if eager.
  }

  // making previewImage key for the inner Spot model inside big Review obj.
  for (let currentBooking of bookingsList) {          // for each big booking obj from this user
    let spot = currentBooking.Spot;                   // this is the included model Spot obj inside current big booking obj.

    for (let image of spot.SpotImages) {              // for each img of all the spot's images MAKE SURE TO PLURALIZE CUZ THE ALIAS?  only works as plural
      if (image.preview) {                            // if that image's preview = true,
        spot.previewImage = image.url;                // add previewImage key to spot (spot model inside review), make its value the image's url value.
      }
    }
    if (!spot.previewImage) {                         // if no preview image found, previewImage key not added,
      spot.previewImage = 'no preview image found'    // add previewImage key, make value this msg.
    }

    delete spot.description;                // get rid of anything u don't need        
    delete spot.updatedAt;                  // remember spot is big review obj's Spot model key.
    delete spot.createdAt; 
    delete spot.SpotImages;                 // works plural or singular for some reason
  }

  res.json({Bookings: bookingsList});     // res.json(bookingsList) returns [{},{}],
});                                       // this returns {"Bookings": [{}, {}]}



// DELETE A BOOKING******************************************************************************************
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  const { user } = req;                             // destructuring/extracting user key from req, and naming it
  // find the booking by its id
  const deletedBooking = await Booking.findByPk(req.params.bookingId);
  const thisBookingSpot = await Spot.findOne({
    where: {id: deletedBooking.spotId}
  });

  // check if this booking id exists
  if (!deletedBooking) {                               // if the target booking to be deleted doesn't exist
    let err = new Error("Booking couldn't be found");  // make a relevant error
    err.status = 404;                                  // make error status
    next(err);                                         // pass along error if this doesn't hit.
  }

  // check if it's too late to delete
  if (Date.parse(deletedBooking.startDate) < Date.now()) {                               // if the target booking to be deleted doesn't exist
    let err = new Error("Bookings that have been started can't be deleted");  // make a relevant error
    err.status = 403;                                  // make error status
    next(err);                                         // pass along error if this doesn't hit.
  }

  // match up logged-in user id to owner id in target spot
  if (user.id === deletedBooking.userId || user.id === thisBookingSpot.ownerId) {             // if the currently logged-in user's id (user.id) === the target property's owner's id,
    await deletedBooking.destroy();                    // destroy the targeted property.
    return res.json({                                  // return the json'ed response:
      message: 'Successfully deleted'                  // success msg.
    });
  } else {                                             // if logged in user is diff to owner of this property
    let err = new Error('Forbidden');                  // make a new error called forbidden.
    err.status = 403;                                  // make error status
    next(err);                                         // pass on error if this doesn't catch.
  };
});



// EDIT A BOOKING **************************************************************************
router.put('/:bookingId', requireAuth, async (req, res, next) => {         // need requireAuth cuz need logged-in guy to have power to edit.
  const { user } = req;                                                    // get user from req (the logged in user's info)
  const { startDate, endDate } = req.body;                                 // all the variables we want to use from req body
  let editBooking = await Booking.findByPk(req.params.bookingId);          // get the specific booking from id.

  // error for nonexistent booking
  if (!editBooking) {                                   // if the target booking to be edited doesn't exist
    let err = new Error("Booking couldn't be found");   // make a relevant error
    err.status = 404;                                   // make error status
    next(err);                                          // pass along error if this doesn't hit.
  }
  // error for if this user is unauthorized to edit this booking
  if (user.id !== editBooking.userId) {                 // if the currently logged-in user's id (user.id) is not the author of this booking (editBooking.userId),
    let err = new Error('Forbidden');                   // make a new error called forbidden.
    err.status = 403;                                   // make error status
    next(err);                                          // pass on error if this doesn't catch.
  };

  // checking for errors and collecting them
  let errorObj = {};                                                              // this where all the errors will be held and returned
  if (Date.parse(startDate) >= Date.parse(endDate)) {                             // if attempted startDate is after attempted endDate (reversed),
    errorObj.endDate = 'endDate cannot be on or before startDate';                // add endDate key to error obj w/ msg value
  }
  if (Object.keys(errorObj).length) {                                             // if the array of all the keys inside errorObj has length > 0
    return res.status(400).json({message: 'Bad Request', errors: errorObj})       // status code 400, plus "message: Bad Request", plus "errors:" plus the errorObj.
  }

  // error for past dates
  if ((Date.parse(endDate) < Date.now())) {                     // attempted endDate is before today's date (already passed)
    let err = new Error("Past bookings can't be modified");     // make a relevant error
    err.status = 403;                                           // make error status
    next(err);                                                  // pass along error if this doesn't hit.
  };  

  // i gotta a find all bookings of this house
  let currentBookings = await Booking.findAll({
    where: {spotId: editBooking.spotId}                         // all bookings with spotId the same as the specific editBooking's spotId.
  });

  // now json the findAll bookings array:
  let bookingsList = [];
  for (let booking of currentBookings) {
    bookingsList.push(booking.toJSON())                         // this makes each booking object json'ed and usable.
  };

  ///////////////////////
  // overlapping dates error, HARDDDDDD
  // refer to my drawing to understand
  // attempted startDates compared to each existing booking dates
  for (let currentBooking of bookingsList) {                                      // iterate thru every booking for this house from bookingsList array
    if (Date.parse(startDate) < Date.parse(currentBooking.endDate)                // if attempted startDate starts before an existing booking's end
      && Date.parse(startDate) > Date.parse(currentBooking.startDate)) {            // while also after the existing booking's start 
        errorObj.startDate = 'Start date conflicts with an existing booking';     // VIOLATION!  add startDate key to error obj w/ msg value
    }
    if (Date.parse(endDate) > Date.parse(currentBooking.startDate)                // if attempted endDate starts after an existing booking's start
      && Date.parse(endDate) < Date.parse(currentBooking.endDate)) {                // while also before the existing booking's end
        errorObj.endDate = 'End Date conflicts with an existing booking';         // VIOLATION!  add endDate key to error obj w/ msg value
    }     
  };                                 
  if (Object.keys(errorObj).length) {                                             // if the array of all the keys inside errorObj has length > 0
    return res.status(403).json({message: 'Sorry, this spot is already booked for the specified dates', errors: errorObj})  // status code 400, plus "message: Bad Request", plus "errors:" plus the errorObj.
  };

  // apply the edits
  editBooking.startDate = startDate;        // if good, make the current booking's startDate key to equal the startDate value from the req body.
  editBooking.endDate = endDate;            // if good, make the current booking's endDate key to equal the endDate value from the req body.


  // return the updated editBooking
  await editBooking.save();
  return res.json(editBooking);
});





module.exports = router;
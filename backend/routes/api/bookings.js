// Instantiate router 
const express = require('express');
const router = express.Router();

// Import model(s)
const { Booking, Spot, SpotImage, User } = require('../../db/models');   // include the models we'll need.
const { requireAuth } = require('../../utils/auth');                     // import the middlewares.

// first gotta import bookings in 1) api/index.js, then 2) app.js √√



// GET ALL BOOKINGS BY CURRENT USER v.2
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;                                 // destructuring/extracting user key from req, and naming it
  const payload = [];                                   // 1 user can have more than 1 booking.  This is a basket.

  // finding all the bookings made by current
  const bookingsOfUser = await Booking.findAll({        // for every findAll, you need to iterate thru each one to json it
    where: { userId: user.id }
  })
    // console.log(bookingsOfUser)
  // console.log(Object.getOwnPropertyNames(Spot.prototype));

  for (let booking of bookingsOfUser) {
    const thisSpot = await Spot.findOne({                    // this specific spot for this booking
      where: { id: booking.spotId },
      attributes: [                                          // only want these attributes
        'id', 
        'ownerId', 
        'address', 
        'city', 
        'state', 
        'country', 
        'lat', 
        'lng', 
        'name', 
        'price'
      ]
    });

    let jsonedSpot = thisSpot.toJSON();                       // only need to json the nested object, not the whole for loop objects.
    const thisSpotImages = await thisSpot.getSpotImages();    // all images

    // skelly
    const bookingSkelly = {
      id: booking.id,
      spotId: booking.spotId,
      userId: user.id,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      Spot: jsonedSpot                                        // saying it again, this value must be json'ed in order to attach more keys inside.
    };

    jsonedSpot.previewImage = 'no preview image found';       // add key to jsonedSpot.  this is default value.
    for (let image of thisSpotImages) {                       // default must come first, if u put in else statement, false will override true due to for loop not exiting till done.
      if (image.preview) {                                    // if that image's preview = true,
        jsonedSpot.previewImage = image.url;                  // override previewImage value to be image's url.
        break;                                                // exits the for loop as soon as true is found, makes more efficient.
      }
    }

    payload.push(bookingSkelly);                              // push filled out skelly to payload for this booking.
  } 

  return res.json({Bookings:payload})                         // return payload big array of all bookings.
});



// GET ALL BOOKINGS BY CURRENT USER************************************************
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;                                       // destructuring/extracting user key from req, and naming it

  // finding all the bookings made by current
  const bookingsOfUser = await Booking.findAll({              // for every findAll, you need to iterate thru each one to json it
    where: {userId: user.id},    
    include: [
      {
        model: Spot,
        include: [{model: SpotImage, attributes: [ 'url', 'preview' ]}]
      }
    ]
  });

  // console.log(Object.getOwnPropertyNames(Spot.prototype));                 // this shows all the custom association

  // for every findAll, you need to iterate thru each one to json it
  let bookingsList = [];
  for (let booking of bookingsOfUser) {                       // toJSON makes it into a POJO to be manipulated.
    bookingsList.push(booking.toJSON())                       // this makes each review object json'ed.  u only json stuff if eager.
  }

  // making previewImage key for the inner Spot model inside big Review obj.
  for (let currentBooking of bookingsList) {                  // for each big booking obj from this user
    let spot = currentBooking.Spot;                           // this is the included model Spot obj inside current big booking obj.

    for (let image of spot.SpotImages) {                      // for each img of all the spot's images MAKE SURE TO PLURALIZE CUZ THE ALIAS?  only works as plural
      if (image.preview) {                                    // if that image's preview = true,
        spot.previewImage = image.url;                        // add previewImage key to spot (spot model inside review), make its value the image's url value.
      }
    }
    if (!spot.previewImage) {                                 // if no preview image found, previewImage key not added,
      spot.previewImage = 'no preview image found'            // add previewImage key, make value this msg.
    }

    delete spot.description;                                  // get rid of anything u don't need        
    delete spot.updatedAt;                                    // remember spot is big review obj's Spot model key.
    delete spot.createdAt; 
    delete spot.SpotImages;                                   // works plural or singular for some reason
  }

  res.json({Bookings: bookingsList});                         // res.json(bookingsList) returns [{},{}],
});                                                           // this returns {"Bookings": [{}, {}]}



// DELETE A BOOKING******************************************************************************************
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  const { user } = req;                                       // destructuring/extracting user key from req, and naming it

  const deletedBooking = await Booking.findByPk(req.params.bookingId);

  // check if this booking id exists
  if (!deletedBooking) {                                      // if the target booking to be deleted doesn't exist
    let err = new Error("Booking couldn't be found");         // make a relevant error
    err.status = 404;                                         // make error status
    next(err);                                                // pass along error if this doesn't hit.
  }

  // check if it's too late to delete
  if (Date.parse(deletedBooking.startDate) < Date.now()) {    // if the target booking to be deleted doesn't exist
    let err = new Error("Bookings that have been started can't be deleted");  // make a relevant error
    err.status = 403;                                         // make error status
    next(err);                                                // pass along error if this doesn't hit.
  }

  const thisBookingSpot = await Spot.findOne({                // find this spot
    where: {id: deletedBooking.spotId}
  });

  // match up logged-in user id to owner id in target spot
  if (user.id === deletedBooking.userId || user.id === thisBookingSpot.ownerId) {     // if user is booker, or user is owner of this spot,
    await deletedBooking.destroy();                           // destroy the targeted property.
    return res.json({                                         // return the json'ed response:
      message: 'Successfully deleted'                         // success msg.
    });
  } else {                                                    // if logged in user is diff to owner of this property
    let err = new Error('Forbidden');                         // make a new error called forbidden.
    err.status = 403;                                         // make error status
    next(err);                                                // pass on error if this doesn't catch.
  };
});



// EDIT A BOOKING **************************************************************************
router.put('/:bookingId', requireAuth, async (req, res, next) => {         // need requireAuth cuz need logged-in guy to have power to edit.
  const { user } = req;                                                    // get user from req (the logged in user's info)
  const { startDate, endDate } = req.body;                                 // all the variables we want to use from req body
  let editBooking = await Booking.findByPk(req.params.bookingId);          // get the specific booking from id.
  // console.log(editBooking)

  // error for nonexistent booking
  if (!editBooking) {                                           // if the target booking to be edited doesn't exist
    let err = new Error("Booking couldn't be found");           // make a relevant error
    err.status = 404;                                           // make error status
    next(err);                                                  // pass along error if this doesn't hit.
  }
  // error for if this user is unauthorized to edit this booking
  if (user.id !== editBooking.userId) {                         // if the currently logged-in user's id (user.id) is not the author of this booking (editBooking.userId),
    let err = new Error('Forbidden');                           // make a new error called forbidden.
    err.status = 403;                                           // make error status
    next(err);                                                  // pass on error if this doesn't catch.
  };

  // error for past dates (the existing booking's end date)
  // console.log(Date.parse(endDate), Date.now())                  // attempted endDate is before today's date (already passed)
  if ((Date.parse(editBooking.endDate) < Date.now())) {         // editBooking.endDate = the end date of the existing booking u want to edit.          
    // console.log('entered if block')
    let err = new Error("Past bookings can't be modified");     // make a relevant error
    err.status = 403;                                           // make error status
    next(err);                                                  // pass along error if this doesn't hit.
  };  

  // error for past dates (forbid u from entering past date as a newly requested date)
  // console.log(Date.parse(endDate), Date.now())
  if ((Date.parse(endDate) < Date.now())) {                     // endDate = new end date from req body
    // console.log('entered if block')
    let err = new Error("Past bookings can't be modified");     // make a relevant error
    err.status = 403;                                           // make error status
    next(err);                                                  // pass along error if this doesn't hit.
  };  

  // checking for errors and collecting them
  let errorObj = {};                                                        // this where all the errors will be held and returned
  if (Date.parse(startDate) >= Date.parse(endDate)) {                       // if attempted startDate is after attempted endDate (reversed),
    errorObj.endDate = 'endDate cannot be on or before startDate';          // add endDate key to error obj w/ msg value
  }
  if (Object.keys(errorObj).length) {                                             // if the array of all the keys inside errorObj has length > 0
    return res.status(400).json({message: 'Bad Request', errors: errorObj})       // status code 400, plus "message: Bad Request", plus "errors:" plus the errorObj.
  }

  // i gotta a find all bookings of this house
  let currentBookings = await Booking.findAll({
    where: {
      spotId: editBooking.spotId                                // all bookings with spotId the same as the specific editBooking's spotId.
    }                          
  });

  // now json the findAll bookings array:
  let bookingsList = [];
  for (let booking of currentBookings) {
    bookingsList.push(booking.toJSON())                          // this makes each booking object json'ed and usable.
  };

  ///////////////////////
  // overlapping dates error, HARDDDDDD
  // refer to my drawing to understand
  // attempted startDates compared to each existing booking dates
  for (let currentBooking of bookingsList) {                                        // iterate thru every booking for this house from bookingsList array
    if (currentBooking.userId !== user.id) {                                        // NEED TO CHECK IF THIS BOOKING IS MY BOOKING.  IF NOT MINE,
      if (Date.parse(startDate) < Date.parse(currentBooking.endDate)                // if attempted startDate starts before an existing booking's end
        && Date.parse(startDate) > Date.parse(currentBooking.startDate)) {            // while also after the existing booking's start 
          errorObj.startDate = 'Start date conflicts with an existing booking';     // VIOLATION!  add startDate key to error obj w/ msg value
      }
      if (Date.parse(endDate) > Date.parse(currentBooking.startDate)                // if attempted endDate starts after an existing booking's start
        && Date.parse(endDate) < Date.parse(currentBooking.endDate)) {                // while also before the existing booking's end
          errorObj.endDate = 'End Date conflicts with an existing booking';         // VIOLATION!  add endDate key to error obj w/ msg value
      }     
      if (Date.parse(startDate) === Date.parse(currentBooking.startDate) 
        || Date.parse(startDate) === Date.parse(currentBooking.endDate)) {          // if new start date is the same as existing start date or existing end date
          errorObj.startDate = 'Start date conflicts with an existing booking';          
      }
      if (Date.parse(endDate) === Date.parse(currentBooking.startDate)              // if new end date is the same as existing start date or existing end date.
        || Date.parse(endDate) === Date.parse(currentBooking.endDate)) {
          errorObj.endDate = 'End Date conflicts with an existing booking';
      }
    }
  };
  ///////////////////////                                
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
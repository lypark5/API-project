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













module.exports = router;
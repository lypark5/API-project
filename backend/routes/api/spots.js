// Instantiate router 
const express = require('express');
const router = express.Router();

// Import model(s)
const { Spot, User, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');      // include the models we'll need.
const { Op } = require('sequelize');       // only need to use this if u gonna use like comparers like Op.lte later
const { requireAuth } = require('../../utils/auth');          // import the middlewares.

// first gotta import reviews in 1) api/index.js, then 2) app.js √√


// GET ALL SPOTS OWNED BY CURRENT LOGGED IN USER v.2
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;                           // need user info 
  const payload = [];                             // need to populate

  // finding all the spots owned by current
  const spotsOfOwner = await Spot.findAll({       // array of spot objects
    where: {ownerId: user.id},                    // all spots whose ownerId matches logged-in id
  });


  for (let spot of spotsOfOwner) {                      // for each spot of this owner
    const thisSpotReviews = await spot.getReviews();    // get all reviews of each spot
    const thisSpotImages = await spot.getSpotImages();  // get all images of each spot

    // making avg
    let sum = 0;
    let count = 0;
    for (let review of thisSpotReviews) {       // for each of this spot's reviews obj's
      sum += review.stars;
      count++;
    }
    let avg = sum / count;

    if (!avg) {
      avg = 'no reviews yet'   // tried to make this edge case message  :c
    }
 

    // skelly
    const spotSkelly = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: avg
    };

    // adding previewImage key for each skelly creation
    spotSkelly.previewImage = 'no preview image found';
    for (let image of thisSpotImages) {              // for each spot, go thru each spotImage
      if (image.preview) {                           // if that image's preview = true,
        spotSkelly.previewImage = image.url;         // add previewImage key to big spotObj, make value the image's url value.
        break;                                       // interrupts and breaks out of the for loop, more efficient.
      } 
    };

    payload.push(spotSkelly);                        // push skelly for each spot
  }
  
  return res.json({Spots:payload})
})











// GET ALL SPOTS OWNED BY CURRENT LOGGED IN USER************************************************
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;                   // destructuring/extracting user key from req, and naming it

  // finding all the spots owned by current
  const spots = await Spot.findAll({      // for every findAll, you need to iterate thru each one to json it
    where: {ownerId: user.id},            // all spots whose ownerId matches logged-in id
    include: [ Review, SpotImage ]        // can write the models in 1 array.
  });
  let spotsList = [];
  for (let spot of spots) {
    spotsList.push(spot.toJSON())                 // this makes each spot object json'ed.
  }

  // making previewImage key for the big spotObj
  for (let spotObj of spotsList) {                // for each json'ed spotObj,
    for (let image of spotObj.SpotImages) {       // go thru each spotObj's image one by one.
      if (image.preview) {                        // if that image's preview = true,
        spotObj.previewImage = image.url;         // add previewImage key to big spotObj, make value the image's url value.
      }
    }
    if (!spotObj.previewImage) {                        // if no preview image found, previewImage key not added,
      spotObj.previewImage = 'no preview image found'   // add previewImage key, make value this msg.
    }

    // making avgRating key for big spotObj
    let sum = 0;
    let count = 0;
    for (let review of spotObj.Reviews) {
      sum += review.stars;
      count++;
    }
    let avg = sum / count;
    spotObj.avgRating = avg;
    if (!spotObj.avgRating) {
      spotObj.avgRating = 'no reviews yet'
    }

    delete spotObj.Reviews;           // delete big model objects which we don't need any more
    delete spotObj.SpotImages;        // delete big model objects which we don't need any more
  }

  res.json({Spots:spotsList});        // res.json(spotsList) returns [{},{}],
});                                   // this returns {"Spots": [{}, {}]}



// GET ALL REVIEWS BY SPOT ID **************************************************************************
router.get('/:spotId/reviews', async (req, res, next) => {
  let reviewsById = await Review.findAll({
    where: {spotId: req.params.spotId},
    include: [
      {
        model: User,
        attributes: [ 'id', 'firstName', 'lastName' ]
      },
      {
        model: ReviewImage,
        as: 'ReviewImages',                     // make sure to add alias in association under Review model √√
        attributes: [ 'id', 'url' ]
      }
    ]
  });

  // error for nonexistent spot
  let targetSpot = await Spot.findByPk(req.params.spotId);
  if (!targetSpot) {                                  // if the target spot to pull reviews from doesn't exist
    let err = new Error("Spot couldn't be found");   // make a relevant error
    err.status = 404;                                  // make error status
    next(err);                                         // pass along error if this doesn't hit.
  }

  res.json({Reviews: reviewsById});
});



// GET ALL BOOKINGS BY SPOT ID **************************************************************************
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { user } = req;                             // destructuring/extracting user key from req, and naming it

  // find all bookings for spot 4
  let bookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId,    
    },
    include: [
      {
        model: User,
        attributes: [ 'id', 'firstName', 'lastName' ]
      }
    ]
  });
  // we got all the bookings of spot 4.

  // gotta json everything for eager
  let bookingsList = [];
  for (let booking of bookings) {
    bookingsList.push(booking.toJSON())             // this makes each spot object json'ed.
  }

  // find Spot 4 obj
  let spotById = await Spot.findByPk(req.params.spotId);    

  if (!spotById) {                                  // if the target spot to be edited doesn't exist
    let err = new Error("Spot couldn't be found");  // make a relevant error
    err.status = 404;                               // make error status
    next(err);                                      // pass along error if this doesn't hit.
  }

  // for loop for every booking obj
  for (let currentBooking of bookingsList) {
    if (spotById.ownerId !== user.id) {             // if owner of Spot 4 is not current user,
      delete currentBooking.User;                   // delete all this stuff
      delete currentBooking.id;
      delete currentBooking.userId;
      delete currentBooking.createdAt;
      delete currentBooking.updatedAt;
    }
  }

  return res.json({Bookings: bookingsList});        // finally return the manipulated or unmanipulated bookings list.
});



// CREATE A REVIEW FOR A SPOT BY SPOT ID **************************************************************************
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
  const { user } = req;                               // destructuring/extracting u
  const { review, stars } = req.body;                 // pull variables i need from req.body

  if (user) {                                         // if user is logged in
    // check if this spot id spot exists
    const targetSpot = await Spot.findByPk(req.params.spotId);      // this is the targeted spot by spotId
    if (!targetSpot) {                                // if the target spot to be deleted doesn't exist
      let err = new Error("Spot couldn't be found");  // make a relevant error
      err.status = 404;                               // make error status
      next(err);                                      // pass along error if this doesn't hit.
    };

    // checking for errors and collecting them
    let errorObj = {};                                              // this where all the real errors will be held and returned
    if (!review) errorObj.review = 'Review text is required';       // if review in req body is empty, add review key to errorObj with msg value
    if (typeof stars !== 'number' || (stars < 1 || stars > 5)) {    // if stars is not a num, not between 1 n 5,
      errorObj.stars = 'Stars must be an integer from 1 to 5';      // add stars key to error obj w/ msg value
    }

    if (Object.keys(errorObj).length) {                                              // if the array of all the keys inside errorObj has length > 0
      return res.status(400).json({message: 'Bad Request', errors: errorObj})        // status code 400, plus "message: Bad Request", plus "errors:" plus the errorObj.
    }

    // find all reviews of this property
    let currentReviews = await Review.findAll({
      where: {spotId: targetSpot.id} 
    });

    let reviewsList = [];                               // need this cuz u did findAll and need to use each one
    for (let review of currentReviews) {                // without this it breaks
      reviewsList.push(review.toJSON())                 // this makes each spot object json'ed.
    }

    // for each review, check if logged-in user already wrote one, throw error
    for (let currentReview of reviewsList) {
      if (currentReview.userId === user.id) {
        let err = new Error("User already has a review for this spot");  // make a relevant error
        err.status = 500;                               // make error status
        next(err);                                      // pass along error if this doesn't hit.
      }
    }

    // create review
    let newReview = await Review.create({
      userId: user.id,
      spotId: targetSpot.id,
      review,
      stars
    });

    return res.status(201).json(newReview);
  }
});



// CREATE A BOOKING FOR A SPOT BY SPOT ID **************************************************************************
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { user } = req;                               // destructuring/extracting u
  const { startDate, endDate } = req.body;                 // pull variables i need from req.body

  // grab house 4
  let spotById = await Spot.findByPk(req.params.spotId);  // get the specific spot from id.

  // check if this spot id spot exists
  if (!spotById) {                                  // if the target spot to be deleted doesn't exist
    let err = new Error("Spot couldn't be found");  // make a relevant error
    err.status = 404;                               // make error status
    next(err);                                      // pass along error if this doesn't hit.
  };

  // find all bookings of this property
  let currentBookings = await Booking.findAll({
    where: {spotId: spotById.id} 
  });

  // now json the findAll bookings array:
  let bookingsList = [];
  for (let booking of currentBookings) {
    bookingsList.push(booking.toJSON())               // this makes each booking object json'ed.
  };

  // if (user) {                                         // if someone is logged in,
    // error for if you own this spot, can't book it
    if (user.id === spotById.ownerId) {               // if the currently logged-in user(user.id) is not the same as the target property's owner (addPicSpot.ownerId),
      let err = new Error('Forbidden');               // make a new error called forbidden.
      err.status = 403;                               // make error status
      next(err);                                      // pass on error if this doesn't catch.
    };

    // checking for errors and collecting them
    let errorObj = {};                                                              // this where all the real errors will be held and returned
    if (Date.parse(startDate) >= Date.parse(endDate)) {                             // if stars is not a num, not between 1 n 5,
      errorObj.endDate = 'endDate cannot be on or before startDate';                // add stars key to error obj w/ msg value
    }
  

    if (Object.keys(errorObj).length) {                                             // if the array of all the keys inside errorObj has length > 0
      return res.status(400).json({message: 'Bad Request', errors: errorObj})       // status code 400, plus "message: Bad Request", plus "errors:" plus the errorObj.
    }

    ///////////////////////
    // overlapping dates error, HARDDDDDD
    // refer to my drawing to understand
    for (let currentBooking of bookingsList) {
      // for each current booking, check:
      // attempted startDates compared to each existing booking dates
      if (Date.parse(startDate) < Date.parse(currentBooking.endDate)
        && Date.parse(startDate) > Date.parse(currentBooking.startDate)) {          // if created startDate starts before an existing booking is over
          errorObj.startDate = 'Start date conflicts with an existing booking';     // add startDate key to error obj w/ msg value
      }
      if (Date.parse(endDate) > Date.parse(currentBooking.startDate)
        && Date.parse(endDate) < Date.parse(currentBooking.endDate)) {              // if created endDate is too long, stepping over existing booking start
          errorObj.endDate = 'End Date conflicts with an existing booking';         // add endDate key to error obj w/ msg value
      }
      if (Date.parse(startDate) === Date.parse(currentBooking.startDate)
        && Date.parse(endDate) ===  Date.parse(currentBooking.endDate)) {           // duplicate dates
          errorObj.startDate = 'Start date conflicts with an existing booking';
          errorObj.endDate = 'End Date conflicts with an existing booking';
      }      
        
      if (Date.parse(startDate) === Date.parse(currentBooking.startDate) 
        || Date.parse(startDate) === Date.parse(currentBooking.endDate)) {          // if new start date is the same as existing start date or existing end date
          errorObj.startDate = 'Start date conflicts with an existing booking';          
      }

      if (Date.parse(endDate) === Date.parse(currentBooking.startDate)              // if new end date is the same as existing start date or existing end date.
        || Date.parse(endDate) === Date.parse(currentBooking.endDate)) {
          errorObj.endDate = 'End Date conflicts with an existing booking';
      }
    };
     ///////////////////////
    if (Object.keys(errorObj).length) {                                             // if the array of all the keys inside errorObj has length > 0
      return res.status(403).json({message: 'Sorry, this spot is already booked for the specified dates', errors: errorObj})  // status code 400, plus "message: Bad Request", plus "errors:" plus the errorObj.
    // }
    };
    

  // create a new booking 
  let newBooking = await Booking.create({         // variable for new img created
    spotId: spotById.id,
    userId: spotById.ownerId,
    startDate,
    endDate
  });  

  return res.json(newBooking);
});



// DELETE A SPOT******************************************************************************************
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const { user } = req;                             // destructuring/extracting user key from req, and naming it
  // console.log(user.id);                          // user.id is the id of the logged-in user.
  const deletedSpot = await Spot.findByPk(req.params.spotId);

  // check if this spot id spot exists
  if (!deletedSpot) {                               // if the target spot to be deleted doesn't exist
    let err = new Error("Spot couldn't be found");  // make a relevant error
    err.status = 404;                               // make error status
    next(err);                                      // pass along error if this doesn't hit.
  }

  // match up logged-in user id to owner id in target spot
  if (user.id === deletedSpot.ownerId) {            // if the currently logged-in user's id (user.id) === the target property's owner's id,
    await deletedSpot.destroy();                    // destroy the targeted property.
      // console.log('-------- entered if block')                   // (testing if it enters this if block)
    return res.json({                               // return the json'ed response:
      message: 'Successfully deleted'               // success msg.
    });
  } else {                                          // if logged in user is diff to owner of this property
    let err = new Error('Forbidden');               // make a new error called forbidden.
    err.status = 403;                               // make error status
    next(err);                                      // pass on error if this doesn't catch.
  };
});



// ADD IMG TO SPOT BY SPOT ID *******************************************************************
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const { user } = req;                                     // get user from req
  const { url, preview } = req.body;                        // all the variables we want to use from req body
  let addPicSpot = await Spot.findByPk(req.params.spotId);  // get the specific spot from id.

  // error for nonexistent spot
  if (!addPicSpot) {                                // if the target spot to add pic to doesn't exist
    let err = new Error("Spot couldn't be found");  // make a relevant error
    err.status = 404;                               // make error status
    next(err);                                      // pass along error if this doesn't hit.
  }
  // error for if you don't own this spot
  if (user.id !== addPicSpot.ownerId) {             // if the currently logged-in user(user.id) is not the same as the target property's owner (addPicSpot.ownerId),
    let err = new Error('Forbidden');               // make a new error called forbidden.
    err.status = 403;                               // make error status
    next(err);                                      // pass on error if this doesn't catch
  };

  // create a new spotImg 
  let newSpotImg = await SpotImage.create({         // variable for new img created
    url,                                            // its attributes upon creation (only 1 word cuz same name)
    preview,                                        // url of newSpotImg: url from req.body
    spotId: addPicSpot.id                           // THIS IS NECESSARY to link this new img to this SPOT
  });                                               // preview of newSpotImg: preview from req.body

  // take out createdAt, updatedAt.
  let jsoned = newSpotImg.toJSON();                 // need to json the big thing to manipulate it before sending off, REMEMBER TO CALL ON THE METHOD
  delete jsoned.createdAt;                          // can now delete createdAt, updatedAt, spotId.
  delete jsoned.updatedAt;
  delete jsoned.spotId;

  return res.json(jsoned);                          // send it off with the nice features.
});



// GET SPOT BY ID v.2
router.get('/:spotId', async (req, res, next) => {
  const thisSpot = await Spot.findByPk(req.params.spotId);        // get this spot first
  
  // catch error if spot doesn't exist                            // needs to be up here or it won't catch.
  if (!thisSpot) {                                                // if the target spot to be edited doesn't exist
    let err = new Error("Spot couldn't be found");                // make a relevant error
    err.status = 404;                                             // make error status
    next(err);                                                    // pass along error if this doesn't hit.
  };
  
  const thisSpotReviews = await thisSpot.getReviews();            // get all reviews on this spot
  const thisSpotImages = await thisSpot.getSpotImages({           // get all images for this spot
    attributes: ['id', 'url', 'preview']                          // only include these to use.
  });
  const ownerObj = await thisSpot.getOwner({
    attributes: ['id', 'firstName', 'lastName']
  });
  
  // console.log(Object.getOwnPropertyNames(Spot.prototype));     // this is COOL! lists all custom association methods of Spot model.

  // making avg
  let sum = 0;
  let count = 0;
  for (let review of thisSpotReviews) {       // for each of this spot's reviews obj's
    sum += review.stars;
    count++;
  }
  let avg = sum / count;
  // in case no reviews for avg calculation
  if (!avg) {
    avg = 'no reviews yet'   // tried to make this edge case message  :c
  }

  
  // skelly
  const spotSkelly = {
    id: thisSpot.id,
    ownerId: thisSpot.ownerId,
    address: thisSpot.address,
    city: thisSpot.city,
    state: thisSpot.state,
    country: thisSpot.country,
    lat: thisSpot.lat,                                  
    lng: thisSpot.lng,
    name: thisSpot.name,
    description: thisSpot.description,
    price: thisSpot.price,
    createdAt: thisSpot.createdAt,
    updatedAt: thisSpot.updatedAt,
    numReviews: thisSpotReviews.length,
    avgStarRating: avg,
    SpotImages: thisSpotImages,
    Owner: ownerObj
  };


  return res.json(spotSkelly);
})



// GET ALL SPOTS v.2
router.get('/', async (req, res, next) => {
  const allSpots = await Spot.findAll();
  const payload = [];

  for (let spot of allSpots) {
    const thisSpotReviews = await spot.getReviews();
    const thisSpotImages = await spot.getSpotImages();

    // making avg
    let sum = 0;
    let count = 0;
    for (let review of thisSpotReviews) {       // for each of this spot's reviews obj's
      sum += review.stars;
      count++;
    }
    let avg = sum / count;

    if (!avg) {
      avg = 'no reviews yet'   // tried to make this edge case message  :c
    }
 

    // skelly
    const spotSkelly = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: avg
    };

    for (let image of thisSpotImages) {
      if (image.preview) {                        // if that image's preview = true,
        spotSkelly.previewImage = image.url;         // add previewImage key to big spotObj, make value the image's url value.
      } else {                        // if no preview image found, previewImage key not added,
        spotSkelly.previewImage = 'no preview image found'   // add previewImage key, make value this msg.
      }
    }

    payload.push(spotSkelly);
  }
  return res.json({Spots:payload})
})





// !!!!!!FORMAT THE PAGINATION AND QUERIES


// GET ALL SPOTS *********************************************************************************
router.get('/', async (req, res, next) => {
  let { minLat, maxLat, minLng, maxLng, minPrice, maxPrice, page, size} = req.query     // whichever query user might put in url ?___=___
  const where = {};                                      // to catch conditionals of where for all the GET Spots, such as where minPrice = 2
  const errorObj = {};                                   // to catch all errors before sending the whole basket at the end

  // need to parse all query stuff before using as normal, cuz i think they are all strings at first
  minLat = parseFloat(minLat);
  maxLat = parseFloat(maxLat);
  minLng = parseFloat(minLng);
  maxLng = parseFloat(maxLng);
  minPrice = parseFloat(minPrice);
  maxPrice = parseFloat(maxPrice);
  page = parseInt(page);
  size = parseInt(size);

  //minLat
  if (minLat || minLat === 0) {
    if (typeof minLat === 'number' && (minLat >= -90 && minLat <= 90)) {
      where.lat = {[Op.gte]: minLat};
    } else {
      errorObj.minLat = 'Minimum latitude is invalid';
    }
  };

  //maxLat
  if (maxLat || maxLat === 0) {
    if (typeof maxLat === 'number' && (maxLat >= -90 && maxLat <= 90)) {
      where.lat = {[Op.lte]: maxLat};
    } else {
      errorObj.maxLat = 'Maximum latitude is invalid';
    }
  };

  //minLng
  if (minLng || minLng === 0) {
    if (typeof minLng === 'number' && (minLng >= -180 && minLng <= 180)) {
      where.lng = {[Op.gte]: minLng};
    } else {
      errorObj.minLng = 'Minimum longitude is invalid';
    }
  };

  //maxLng
  if (maxLng || maxLng === 0) {
    if (typeof maxLng === 'number' && (maxLng >= -180 && maxLng <= 180)) {
      where.lng = {[Op.lte]: maxLng};
    } else {
      errorObj.maxLng = 'Maximum longitude is invalid';
    }
  };

  //minPrice
  if (minPrice || minPrice === 0) {
    if (typeof minPrice === 'number' && minPrice >= 0) {
      where.price = {[Op.gte]: minPrice};
    } else {
      errorObj.minPrice = 'Minimum price must be greater than or equal to 0';
    }
  };

  //maxPrice
  if (maxPrice || maxPrice === 0) {
    if (typeof maxPrice === 'number' && maxPrice >= 0) {
      where.price = {[Op.lte]: maxPrice};
    } else {
      errorObj.maxPrice = 'Maximum price must be greater than or equal to 0';
    }
  };


  // PAGINATION~~~~
  let pagination = {};

  //errors
  if (page < 1) errorObj.page = 'Page must be greater than or equal to 1';
  if (size < 1) errorObj.size = 'Size must be greater than or equal to 1';  
  // collecting all the errors
  if (Object.keys(errorObj).length) {                                              // if the array of all the keys inside errorObj has length > 0
    return res.status(400).json({message: 'Bad Request', errors: errorObj})        // status code 400, plus "message: Bad Request", plus "errors:" plus the errorObj.
  };                                                                               // BE MINDFUL OF PLACEMENT, this needs to include all the top filters plus pagination errors.

  // default 
  if (isNaN(page) || !page) page = 1;      
  if (isNaN(size) || !size ) size = 20;    
  //max
  if (page > 10) page = 10;
  if (size > 20) size = 20;    

  // limit n offset
  pagination.limit = size;
  pagination.offset = size * (page - 1);
                                                              


  // **********************************
  // the real GET ALL SPOTS!!~~~
  const spots = await Spot.findAll({              // for every findAll, you need to iterate thru each one to json it
    where,                                        // *** i added this for the query filter step
    ...pagination,                                // *** i added this for the pagination step

    include: [ Review, SpotImage ]                // can write the models in 1 array.
  });

  // json'ed array
  let spotsList = [];                             // this shows the correct array response of all the big objects.
  for (let spot of spots) {
    spotsList.push(spot.toJSON())                 // this makes each spot object json'ed.
  }
           
  // making previewImage key for the big spotObj
  for (let spotObj of spotsList) {                // for each json'ed spotObj,
    for (let image of spotObj.SpotImages) {       // go thru each spotObj's image one by one.
      if (image.preview) {                        // if that image's preview = true,
        spotObj.previewImage = image.url;         // add previewImage key to big spotObj, make value the image's url value.
      }
    }
    if (!spotObj.previewImage) {                        // if no preview image found, previewImage key not added,
      spotObj.previewImage = 'no preview image found'   // add previewImage key, make value this msg.
    }

    // making avgRating key for big spotObj
    let sum = 0;
    let count = 0;
    for (let review of spotObj.Reviews) {
      sum += review.stars;
      count++;
    }
    let avg = sum / count;
    spotObj.avgRating = avg;
    if (!spotObj.avgRating) {
      spotObj.avgRating = 'no reviews yet'
    }

    delete spotObj.Reviews;           // delete big model objects which we don't need any more
    delete spotObj.SpotImages;        // delete big model objects which we don't need any more
  }

  
  // FINALLY!! return as usual except tack on page, size
  return res.json({                   // res.json(spotsList) returns [{},{}],
    Spots:spotsList,                  // this returns {"Spots": [{}, {}]}
    page,                             // ***added this during pagination phase
    size                              // ***added this during pagination phase
  })
});       



// CREATE A SPOT **************************************************************************
router.post('/', requireAuth, async (req, res, next) => {
  const { user } = req;               // destructuring/extracting user key from req, and naming it
  if (user) {                         // if user is logged in
    const { address, city, state, country, lat, lng, name, description, price } = req.body;   // take out these variables from req.body

    // checking for errors and collecting them
    let errorObj = {};                                                   // this where all the real errors will be held and returned
    if (!address) errorObj.address = 'Street address is required';       // if address in req body is empty, add address key to errorObj with msg value
    if (!city) errorObj.city = 'City is required';                       // if city in req body is empty, add city key to errorObj with msg value
    if (!state) errorObj.state = 'State is required';                    // if state in req body is empty, add state key to errorObj with msg value
    if (!country) errorObj.country = 'Country is required';              // if country in req body is empty, add country key to errorObj with msg value
    if (typeof lat !== 'number' || (lat < -90 || lat > 90)) {            // if latitude in req body is invalid, add lat key to errorObj with msg value
      errorObj.lat = 'Latitude is not valid';  
    };                  
    if (typeof lng !== 'number' || (lng < -180 || lng > 180)) {          // if longitude in req body is invalid, add lng key to errorObj with msg value
      errorObj.lng = 'Longitude is not valid';
    };                   
    if (name.length >= 50) errorObj.name = 'Name must be less than 50 characters';   // if name in req body is too long, add name key to errorObj with msg value
    if (!description) errorObj.description = 'Description is required';  // if description in req body is empty, add description key to errorObj with msg value
    if (!price) errorObj.price = 'Price per day is required';            // if price in req body is empty, add price key to errorObj with msg value

    // return an error with the error obj if sth is invalid
    if (Object.keys(errorObj).length) {                                              // if the array of all the keys inside errorObj has length > 0
      return res.status(400).json({message: 'Bad Request', errors: errorObj})        // status code 400, plus "message: Bad Request", plus "errors:" plus the errorObj.
    }

    let createdSpot = await Spot.create({                                // must create AFTER doing all the error catching.
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    return res.status(201).json(createdSpot);
  }
});



// EDIT A SPOT **************************************************************************
router.put('/:spotId', requireAuth, async (req, res, next) => {                                 // need requireAuth cuz need logged-in guy to have power to edit.
  const { user } = req;                                                                         // get user from req (the logged in user's info)
  const { address, city, state, country, lat, lng, name, description, price } = req.body;       // all the variables we want to use from req body
  let editSpot = await Spot.findByPk(req.params.spotId);                                        // get the specific spot from id.

  // error for nonexistent spot
  if (!editSpot) {                                  // if the target spot to be edited doesn't exist
    let err = new Error("Spot couldn't be found");  // make a relevant error
    err.status = 404;                               // make error status
    next(err);                                      // pass along error if this doesn't hit.
  }
  // error for if this user is unauthorized to edit this spot
  if (user.id !== editSpot.ownerId) {               // if the currently logged-in user's id (user.id) !== the target property's owner's id,
    let err = new Error('Forbidden');               // make a new error called forbidden.
    err.status = 403;                               // make error status
    next(err);                                      // pass on error if this doesn't catch.
  };

  // checking for errors and collecting them
  let errorObj = {};                                                   // this where all the errors will be held and returned
  if (!address) errorObj.address = 'Street address is required';       // if address in req body is empty, add address key to errorObj with msg value
  if (!city) errorObj.city = 'City is required';                       // if city in req body is empty, add city key to errorObj with msg value
  if (!state) errorObj.state = 'State is required';                    // if state in req body is empty, add state key to errorObj with msg value
  if (!country) errorObj.country = 'Country is required';              // if country in req body is empty, add country key to errorObj with msg value
  if (typeof lat !== 'number' || (lat < -90 || lat > 90)) {            // if latitude in req body is invalid, add lat key to errorObj with msg value
    errorObj.lat = 'Latitude is not valid';  
  };                  
  if (typeof lng !== 'number' || (lng < -180 || lng > 180)) {          // if longitude in req body is invalid, add lng key to errorObj with msg value
    errorObj.lng = 'Longitude is not valid';
  };                   
  if (name.length >= 50) errorObj.name = 'Name must be less than 50 characters';   // if name in req body is too long, add name key to errorObj with msg value
  if (!description) errorObj.description = 'Description is required';  // if description in req body is empty, add description key to errorObj with msg value
  if (!price) errorObj.price = 'Price per day is required';            // if price in req body is empty, add price key to errorObj with msg value

  // return an error with the error obj if sth is invalid
  if (Object.keys(errorObj).length) {                                              // if the array of all the keys inside errorObj has length > 0
    return res.status(400).json({message: 'Bad Request', errors: errorObj})        // status code 400, plus "message: Bad Request", plus "errors:" plus the errorObj.
  }

  // if good, make the current spot's key to equal the value from the req body.
  editSpot.address = address;
  editSpot.city = city;
  editSpot.state = state;
  editSpot.country = country;
  editSpot.lat = lat;
  editSpot.lng = lng;
  editSpot.name = name;
  editSpot.description = description;
  editSpot.price = price;

  // return the updated editSpot
  await editSpot.save();
  return res.json(editSpot);
});





module.exports = router;












// DISCARDED TRASH BUT IT WORKED FOR LOCAL:
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
/*
// GET SPOT BY ID **************************************************************************
router.get('/:spotId', async (req, res, next) => {
  let spotById = await Spot.findByPk(req.params.spotId, {
    include: [ 
      {
        model: Review
      }, 
      {
        model: SpotImage,
        attributes: [ 'id', 'url', 'preview' ] 
      }, 
      {
        model: User,
        as: 'Owner',                // make sure to go to Spot model and add this alias to this foreign key. √√
        attributes: [ 'id', 'firstName', 'lastName' ]
      }
    ]    
  }); // up to here returns a regular spot, need to add numReviews, avgStarRating,SpotImages(id,url,preview),Owner(id,firstName,lastName)

  // catch error if spot doesn't exist  
  if (!spotById) {                                  // if the target spot to be edited doesn't exist
    let err = new Error("Spot couldn't be found");  // make a relevant error
    err.status = 404;                               // make error status
    next(err);                                      // pass along error if this doesn't hit.
  }

  // make spotById obj workable by making it json'ed.
  let jsonedSpotById = spotById.toJSON();           // only need this when i eager load

  // numReviews
  jsonedSpotById.numReviews = jsonedSpotById.Reviews.length
 
  // avgRating
  let sum = 0;
  let count = 0;
  for (let review of jsonedSpotById.Reviews) {
    sum += review.stars;
    count++;
  }
  let avg = sum / count;
  jsonedSpotById.avgStarRating = avg;
  if (!jsonedSpotById.avgStarRating) {
    jsonedSpotById.avgStarRating = 'no reviews yet'
  }

  delete jsonedSpotById.Reviews;

  res.json(jsonedSpotById);
});
*/
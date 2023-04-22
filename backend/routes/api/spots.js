// Instantiate router 
const express = require('express');
const router = express.Router();

// Import model(s)
const { Spot, User, Review, SpotImage } = require('../../db/models');      // include the models we'll need.
// const { Op } = require('sequelize');       // only need to use this if u gonna use like comparers like Op.lte later
const { requireAuth } = require('../../utils/auth');          // import the middlewares.



// GET ALL SPOTS OWNED BY CURRENT LOGGED IN USER************************************************
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;             // destructuring/extracting user key from req, and naming it
  // console.log('----------', user.id);  // to test if this endpoint is hitting.

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

  
  if (!addPicSpot) {                                // if the target spot to be edited doesn't exist
    let err = new Error("Spot couldn't be found");  // make a relevant error
    err.status = 404;                               // make error status
    next(err);                                      // pass along error if this doesn't hit.
  }
  if (user.id !== addPicSpot.ownerId) {             // if the currently logged-in user's id (user.id) !== the target property's owner's id,
                                                    // if logged in user is diff to owner of this property
    let err = new Error('Forbidden');               // make a new error called forbidden.
    err.status = 403;                               // make error status
    next(err);                                      // pass on error if this doesn't catch.
  };

  // create a new spotImg 
  let newSpotImg = await SpotImage.create({         
    url,                                            // with body consisting of url, preview equaling to the url, preview from req.body.
    preview
  });

  // take out createdAt, updatedAt.
  let jsoned = newSpotImg.toJSON();                 // need to json the big thing to manipulate it before sending off, REMEMBER TO CALL ON THE METHOD
  delete jsoned.createdAt;                          // can now delete createdAt, updatedAt, spotId.
  delete jsoned.updatedAt;
  delete jsoned.spotId;

  return res.json(jsoned);                          // send it off with the nice features.
});


// SPOT BY ID **************************************************************************
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


// GET ALL SPOTS *********************************************************************************
router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({              // for every findAll, you need to iterate thru each one to json it
    include: [ Review, SpotImage ]                // can write the models in 1 array.
  });
  let spotsList = [];
  for (let spot of spots) {
    spotsList.push(spot.toJSON())                 // this makes each spot object json'ed.
  }
  // console.log(spotsList);                      // this shows the correct array response of all the big objects.

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
});                                   // this returns {"Sports": [{}, {}]}


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
  const { user } = req;                                                                         // get user from req
  const { address, city, state, country, lat, lng, name, description, price } = req.body;       // all the variables we want to use from req body
  let editSpot = await Spot.findByPk(req.params.spotId);                                        // get the specific spot from id.

  
  if (!editSpot) {                                  // if the target spot to be edited doesn't exist
    let err = new Error("Spot couldn't be found");  // make a relevant error
    err.status = 404;                               // make error status
    next(err);                                      // pass along error if this doesn't hit.
  }
  if (user.id !== editSpot.ownerId) {               // if the currently logged-in user's id (user.id) !== the target property's owner's id,
                                                    // if logged in user is diff to owner of this property
    let err = new Error('Forbidden');               // make a new error called forbidden.
    err.status = 403;                               // make error status
    next(err);                                      // pass on error if this doesn't catch.
  };

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
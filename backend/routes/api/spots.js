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
    where: {ownerId: user.id},
    include: [ Review, SpotImage ]        // can write the models in 1 array.
  });
  let spotsList = [];
  for (let spot of spots) {
    spotsList.push(spot.toJSON())                 // this makes each spot object json'ed.
  }

  // making previewImage key for the big spotObj
  for (let spotObj of spotsList) {                // for each json'ed spotObj,
    for (let image of spotObj.SpotImages) {       // go thru each spotObj's image one by one.
      if (image.preview) {                        // here we check that each image's preview returns true.
        spotObj.previewImage = image.url;           // add previewImage key to big spotObj, make value the image's url value.
      }
    }
    if (!spotObj.previewImage) {
      spotObj.previewImage = 'no preview image found'
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
});                                      // this returns {"Sports": [{}, {}]}


// ADD IMG TO SPOT BY SPOT ID *******************************************************************
// router.post('/:spotId/images', requireAuth, async (req, res, next) => {

// })

// DELETE A SPOT
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const { user } = req;             // destructuring/extracting user key from req, and naming it
  // console.log(user.id);
  const deletedSpot = await Spot.findByPk(req.params.spotId);
  // console.log(user.id, deletedSpot.ownerId)     // user.id is the current user's id, deletedSpot.ownerId is the id of the owner of the spot property param
  if (!deletedSpot) {
    let err = new Error("Spot couldn't be found");
    err.status = 404;
    next(err);
  }
  if (user.id === deletedSpot.ownerId) {
    await deletedSpot.destroy();
      // console.log('-------- entered if block-----')
    return res.json({
      message: 'Successfully deleted'
    });
  } else {
    let err = new Error('Forbidden');
    err.status = 403;
    next(err);
  };
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
          as: 'Owner',
          attributes: [ 'id', 'firstName', 'lastName' ]
        }
      ]    

  });    // this returns a regular spot, need to add numReviews, avgStarRating,SpotImages(id,url,preview),Owner(id,firstName,lastName)

  // make spotById obj workable by making it json'ed.
  let jsonedSpotById = spotById.toJSON();   

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
  const spots = await Spot.findAll({      // for every findAll, you need to iterate thru each one to json it
    include: [ Review, SpotImage ]        // can write the models in 1 array.
  });
  let spotsList = [];
  for (let spot of spots) {
    spotsList.push(spot.toJSON())                 // this makes each spot object json'ed.
  }
  // console.log(spotsList);                      // this shows the correct array response of all the big objects.

  // making previewImage key for the big spotObj
  for (let spotObj of spotsList) {                // for each json'ed spotObj,
    for (let image of spotObj.SpotImages) {       // go thru each spotObj's image one by one.
      if (image.preview) {                        // here we check that each image's preview returns true.
        spotObj.previewImage = image.url;           // add previewImage key to big spotObj, make value the image's url value.
      }
    }
    if (!spotObj.previewImage) {
      spotObj.previewImage = 'no preview image found'
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
});                                      // this returns {"Sports": [{}, {}]}


// CREATE A SPOT **************************************************************************
router.post('/', requireAuth, async (req, res, next) => {
  const { user } = req;             // destructuring/extracting user key from req, and naming it
  // console.log(req.user);         // testing to see if req has a user attribute.
  // console.log('----------This is user in create spot', user.id)
  if (user) {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    let createdSpot = await Spot.create({
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



module.exports = router;
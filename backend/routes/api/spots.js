// Instantiate router 
const express = require('express');
const router = express.Router();

// Import model(s)
const { Spot, User, Review, SpotImage, sequelize } = require('../../db/models');      // include the models we'll need.
// const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

// GET ALL SPOTS ****************
router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({      // for every findAll, you need to iterate thru each one to json it
    include: [ Review, SpotImage ]        // can write the models in 1 array.
  });
  let spotsList = [];
  for (let spot of spots) {
    spotsList.push(spot.toJSON())             // this makes each spot object json'ed.
  }

  // spots.forEach(spot => {
  //   spotsList.push(spot.toJSON())             // this makes each spot object json'ed.
  // })



  for (let spotObj of spotsList) {
    for (let image of spotObj.SpotImages) {
      if (image.preview) {
        spotObj.previewImage = image.url
      }
    }
    if (!spotObj.previewImage) {
      spotObj.previewImage = 'no preview image found'
    }

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

    delete spotObj.Reviews;
    delete spotObj.SpotImages;

  }


  // console.log(spotsList);                     // this shows the correct array response of all the big objects.

  // spotsList.forEach(spot => {                 // for each json'ed spot obj (called spot)
  //   spot.SpotImages.forEach(spotimage => {      // go thru each spot's image one by one
  //     // console.log(spotimage.preview)         // here we check that each spotimage's preview returns true or false.
  //     if (spotimage.preview === true) {
  //       // console.log(spotimage)             // these return every spotimage object whose preview is true.
  //       spot.previewImage = spotimage.url
  //     }
  //   })
  // })

  res.json(spotsList);
});


// SPOT BY ID **********
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



// CREATE A SPOT **********
router.post('/', async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price} = req.body;
  let createdSpot = await Spot.create({
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
});



module.exports = router;
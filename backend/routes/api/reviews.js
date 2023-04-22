// Instantiate router 
const express = require('express');
const router = express.Router();

// Import model(s)
const { Review, Spot, User, ReviewImage, SpotImage } = require('../../db/models');      // include the models we'll need.
// const { Op } = require('sequelize');       // only need to use this if u gonna use like comparers like Op.lte later
const { requireAuth } = require('../../utils/auth');          // import the middlewares.

// first gotta import reviews in 1) api/index.js, then 2) app.js √√

// GET ALL REVIEWS BY CURRENT LOGGED IN USER************************************************
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;                           // destructuring/extracting user key from req, and naming it.  req.user = there is a logged-in user.
  const reviewsOfUser = await Review.findAll({    // for every findAll, you need to iterate thru each one to json it
    where: {userId: user.id},                     // all spots whose ownerId matches logged-in id
    include: [ 
      {
        model: User,
        attributes: [ 'id', 'firstName', 'lastName' ]
      }, 
      {
        model: Spot,
        include: [{model: SpotImage, attributes: [ 'url', 'preview' ]}]
      }, 
      {
        model: ReviewImage,
        as: 'ReviewImages',      // need to change alias in Review model √√
        attributes: [ 'id', 'url' ]
      } 
    ]                
  });
  // up to here returns a regular review with added User, Spot, ReviewImages, need to add more.

  // for every findAll, you need to iterate thru each one to json it
  let reviewsList = [];
  for (let review of reviewsOfUser) {
    reviewsList.push(review.toJSON())                 // this makes each review object json'ed.  u only json stuff if eager.
  }

  // making previewImage key for the inner Spot model inside big Review obj.
  for (let currentReview of reviewsList) {            // for each big review obj from this user
    let spot = currentReview.Spot;                    // this is the current Spot obj inside current big review obj.

    for (let image of spot.SpotImages) {              // for each img of all the spot's images MAKE SURE TO PLURALIZE CUZ THE ALIAS
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
  delete spot.SpotImages;                 // remember to pluralize this cuz of alias.
  }
  res.json({Reviews:reviewsList});        // res.json(reviewsList) returns [{},{}],
});                                       // this returns {"Reviews": [{}, {}]}


module.exports = router;
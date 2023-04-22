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
  
  // find all reviews of current
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
    let spot = currentReview.Spot;                    // this is the included model Spot obj inside current big review obj.

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
  res.json({Reviews:reviewsList});        // res.json(reviewsList) returns [{},{}],
});                                       // this returns {"Reviews": [{}, {}]}



// DELETE A REVIEW**********************************************************************
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
  const { user } = req;                               // destructuring/extracting user key from req, and naming it
  // console.log(user.id);                            // user.id is the id of the logged-in user.
  const deletedReview = await Review.findByPk(req.params.reviewId);

  // check if this review id review exists
  if (!deletedReview) {                               // if the target review to be deleted doesn't exist
    let err = new Error("Review couldn't be found");  // make a relevant error
    err.status = 404;                                 // make error status
    next(err);                                        // pass along error if this doesn't hit.
  }

  // match up logged-in user id to this review's author's id in target spot
  if (user.id === deletedReview.userId) {             // if the currently logged-in user's id (user.id) === the target review's author's id,
    await deletedReview.destroy();                    // destroy the targeted review.
    return res.json({                                 // return the json'ed response:
      message: 'Successfully deleted'                 // success msg.
    });
  } else {                                            // if logged in user is diff to author of this review
    let err = new Error('Forbidden');                 // make a new error called forbidden.
    err.status = 403;                                 // make error status
    next(err);                                        // pass on error if this doesn't catch.
  };
});



// ADD IMG TO REVIEW BY REVIEW ID *******************************************************************
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  const { user } = req;                                           // get user from req
  const { url } = req.body;                                       // all the variables we want to use from req body

  let addPicReview = await Review.findByPk(req.params.reviewId);  // get the specific spot from id.

  // error for nonexistent review
  if (!addPicReview) {                                 // if the target review to add pic to doesn't exist
    let err = new Error("Review couldn't be found");   // make a relevant error
    err.status = 404;                                  // make error status
    next(err);                                         // pass along error if this doesn't hit.
  }

  // error for exceeding max imgs
  let count = await ReviewImage.findAll({where: {reviewId: addPicReview.id}});
  // console.log('---------------', count)
  if (count.length >= 10) {
    let err = new Error('Maximum number of images for this resource was reached');
    err.status = 403;
    next(err);
  }

  // error for if u don't own this review
  if (user.id !== addPicReview.userId) {               // if the currently logged-in user(user.id) is not the same as the author of this review(addPicReview.userId),
    let err = new Error('Forbidden');                  // make a new error called forbidden.
    err.status = 403;                                  // make error status
    next(err);                                         // pass on error if this doesn't catch.
  };

  // create a new reviewImg 
  let newReviewImg = await ReviewImage.create({        // variable for new img created                                           // its attributes upon creation (only 1 word cuz same name)
    reviewId: addPicReview.id,                         // this is the anchor for the target Review's id, U NEED THIS
    url                                                // id of newReviewImg: newly generated id
  });                                                  // url of newReviewImg: url from req.body

  // take out createdAt, updatedAt.
  let jsoned = newReviewImg.toJSON();                  // need to json the big thing to manipulate it before sending off, REMEMBER TO CALL ON THE METHOD
  delete jsoned.createdAt;                             // can now delete createdAt, updatedAt, spotId.
  delete jsoned.updatedAt;
  delete jsoned.reviewId;

  // let toUser = {};
  // toUser.url = newReviewImg.url
  // toUser.id = newReviewImg.id                      // alternative way to return select keys


  return res.json(jsoned);                            // send it off with the nice features.
});



// EDIT A REVIEW **************************************************************************
router.put('/:reviewId', requireAuth, async (req, res, next) => {  // need requireAuth cuz need logged-in guy to have power to edit.
  const { user } = req;                                            // get user from req (the logged in user's info)
  const { review, stars } = req.body;                              // all the variables we want to use from req body
  let editReview = await Review.findByPk(req.params.reviewId);     // get the specific review from id.

  // error for nonexistent review
  if (!editReview) {                                  // if the target spot to be edited doesn't exist
    let err = new Error("Review couldn't be found");  // make a relevant error
    err.status = 404;                                 // make error status
    next(err);                                        // pass along error if this doesn't hit.
  }
  // error for this current user is unauthorized to edit the post
  if (user.id !== editReview.userId) {                // if the currently logged-in user's id (user.id) !== the target property's owner's id,
    let err = new Error('Forbidden');                 // make a new error called forbidden.
    err.status = 403;                                 // make error status
    next(err);                                        // pass on error if this doesn't catch.
  };

  // checking for errors and collecting them
  let errorObj = {};                                              // this where all the errors will be held and returned
  if (!review) errorObj.review = 'Review text is required';       // if review in req body is empty, add review key to errorObj with msg value
  if (typeof stars !== 'number' || (stars < 1 || stars > 5)) {    // if stars in req body is invalid, add stars key to errorObj with msg value
    errorObj.stars = 'Stars must be an integer from 1 to 5';     
  };

  // return an error with the error obj if sth is invalid
  if (Object.keys(errorObj).length) {                                          // if the array of all the keys inside errorObj has length > 0
    return res.status(400).json({message: 'Bad Request', errors: errorObj})    // status code 400, plus "message: Bad Request", plus "errors:" plus the errorObj.
  };

  // if good, make the current spot's key to equal the value from the req body.
  editReview.review = review;                                     // must be explicit with this assignment.
  editReview.stars = stars;

  // return the updated editSpot
  await editReview.save();
  return res.json(editReview);
});





module.exports = router;
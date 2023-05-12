// Instantiate router 
const express = require('express');
const router = express.Router();

// Import model(s)
const { Review, ReviewImage } = require('../../db/models');   // include the models we'll need.
const { requireAuth } = require('../../utils/auth');          // import the middlewares.

// first gotta import bookings in 1) api/index.js, then 2) app.js √√



// DELETE A REVIEW IMG******************************************************************************
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { user } = req;                                      // destructuring/extracting user key from req

  // find the review img by its id
  const deletedImg = await ReviewImage.findByPk(req.params.imageId);

  // check if this review img id exists
  if (!deletedImg) {                                         // if the target spot img to be deleted doesn't exist
    let err = new Error("Review Image couldn't be found");   // make a relevant error
    err.status = 404;                                        // make error status
    next(err);                                               // pass along error if this doesn't hit.
  }

  const thisReview = await Review.findOne({
    where: {id: deletedImg.reviewId}
  });

  // match up logged-in user id to this review's author
  if (user.id === thisReview.userId) {                       // if the currently logged-in user's id (user.id) === the review's author id,
    await deletedImg.destroy();                              // destroy the targeted review img.
    return res.json({                                        // return the json'ed response:
      message: 'Successfully deleted'                        // success msg.
    });
  } else {                                                   // if logged in user is diff to spot owner
    let err = new Error('Forbidden');                        // make a new error called forbidden.
    err.status = 403;                                        // make error status
    next(err);                                               // pass on error if this doesn't catch.
  };
});





module.exports = router;
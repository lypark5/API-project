// Instantiate router 
const express = require('express');
const router = express.Router();

// Import model(s)
const { Spot, SpotImage } = require('../../db/models');   // include the models we'll need.
const { requireAuth } = require('../../utils/auth');      // import the middlewares.

// first gotta import bookings in 1) api/index.js, then 2) app.js √√



// DELETE A SPOT IMG******************************************************************************
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { user } = req;                                   // destructuring/extracting user key from req

  const deletedImg = await SpotImage.findByPk(req.params.imageId);

  // check if this spot img id exists
  if (!deletedImg) {                                      // if the target spot img to be deleted doesn't exist
    let err = new Error("Spot Image couldn't be found");  // make a relevant error
    err.status = 404;                                     // make error status
    next(err);                                            // pass along error if this doesn't hit.
  }

  const thisSpot = await Spot.findOne({
    where: {id: deletedImg.spotId}
  });

  // match up logged-in user id to this spot's owner
  if (user.id === thisSpot.ownerId) {                     // if the currently logged-in user's id (user.id) === the spot's ownerId,
    await deletedImg.destroy();                           // destroy the targeted spot img.
    return res.json({                                     // return the json'ed response:
      message: 'Successfully deleted'                     // success msg.
    });
  } else {                                                // if logged in user is diff to spot owner
    let err = new Error('Forbidden');                     // make a new error called forbidden.
    err.status = 403;                                     // make error status
    next(err);                                            // pass on error if this doesn't catch.
  };
});





module.exports = router;
//// after clearing tests ////

const router = require('express').Router();
const sessionRouter = require('./session.js');        // add this every time for connecting router
const usersRouter = require('./users.js');            // add this every time for connecting router
const spots = require('./spots.js');                  // add this every time for connecting router
const reviews = require('./reviews.js');              // add this every time for connecting router
const bookings = require('./bookings.js');            // add this every time for connecting router
const spotimages = require('./spot-images.js');       // add this every time for connecting router
const reviewimages = require('./review-images.js');   // add this every time for connecting router
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);                      // want to hit this first before all router stuff.  adds req.user to ur req.

router.use('/session', sessionRouter);        // tell ur app.js to use login router
router.use('/users', usersRouter);            // tell ur app.js to use signup router
router.use('/spots', spots);                  // tell ur app.js to use spots router
router.use('/reviews', reviews);              // tell ur app.js to use reviews router
router.use('/bookings', bookings);            // tell ur app.js to use bookings router
router.use('/spot-images', spotimages);       // tell ur app.js to use spotimages router
router.use('/review-images', reviewimages);   // tell ur app.js to use reviewimages router

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
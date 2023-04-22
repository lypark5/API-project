// Instantiate router 
const express = require('express');
const router = express.Router();

// Import model(s)
const { Booking, Spot, User } = require('../../db/models');   // include the models we'll need.
// const { Op } = require('sequelize');       // only need to use this if u gonna use like comparers like Op.lte later
const { requireAuth } = require('../../utils/auth');          // import the middlewares.

// first gotta import bookings in 1) api/index.js, then 2) app.js √√














module.exports = router;
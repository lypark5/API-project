// Instantiate router 
const express = require('express');
const router = express.Router();

// Import model(s)
const { Spot, User, Review, ReviewImage, sequelize } = require('../../db/models');
// const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

// List of spots
router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({
    include: [
      {
        model: Review,

      },
      {
        model: ReviewImage,

      }
    ]
  });
  let spotsList = [];
  spots.forEach(spot => {
    spotsList.push(spot.toJSON())
  })

  res.json(spots);
});

module.exports = router;
// Instantiate router 
const express = require('express');
const router = express.Router();

// Import model(s)
const { Spot, User, sequelize } = require('../../db/models');
const { Op } = require('sequelize');

// List of spots
router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll();
  res.json(spots);
});

module.exports = router;
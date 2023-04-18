'use strict';

const { Booking, User, Spot } = require('../models');
// need to modify joint tables

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      { 
        spotId: 2,   // hobbit house
        userId: 3,   // tego calderon
        startDate: new Date ('2023-08-13'),
        endDate: new Date ('2023-08-20')
      },
      { 
        spotId: 7,   // bretman rock's neighbor
        userId: 2,   // homer simpson
        startDate: new Date ('2023-05-01'),
        endDate: new Date ('2023-06-01')
      },
      { 
        spotId: 4,   // shigol house
        userId: 1,   // demo lition
        startDate: new Date ('2023-05-30'),
        endDate: new Date ('2023-06-12')
      },
      { 
        spotId: 2,   // hobbit house
        userId: 4,   // spider man
        startDate: new Date ('2023-09-09'),
        endDate: new Date ('2023-09-19')
      },
      { 
        spotId: 3,   // totoro house
        userId: 5,   // peter parker
        startDate: new Date ('2023-10-16'),
        endDate: new Date ('2023-10-21')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options);
  }
};

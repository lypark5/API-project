'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 2,    // hobbit house   // 1
        userId: 3,    // tego calderon
        review: "'Twas satisfactory, says I.  I ate all the food.",
        stars: 5
      },
      {
        spotId: 7,    // bretman rock's neighbor  // 2
        userId: 2,    // homer simpson
        review: "*slobber noises.  We supped on frosty chocolate milkshakes with Bretman Rock and enjoyed Hawaii.",
        stars: 5
      },
      {
        spotId: 4,    // shigol house   // 3
        userId: 1,    // demo lition
        review: "Wth there was a squatter toilet?  Not good for foreigners.",
        stars: 2
      },
      {
        spotId: 2,    // hobbit house   // 4
        userId: 4,    // spider man
        review: "Too clean, not enough places to make spider webs.",
        stars: 3
      },
      {
        spotId: 3,    // totoro house   // 5
        userId: 5,    // peter parker
        review: "Very peaceful, great place for my photography.  There were some soot sprites, though.",
        stars: 4
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options);
  }
};

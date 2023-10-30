'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,    // pebble house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/cottage1.jpg',
        preview: true
      },
      {
        spotId: 2,    // hobbit house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/hobbit1.jpg',
        preview: true
      },
      {
        spotId: 2,    // hobbit house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/hobbit2.jpg',
        preview: false
      },
      {
        spotId: 2,    // hobbit house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/hobbit3.webp',
        preview: false
      },
      {
        spotId: 2,    // hobbit house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/hobbit4.jpg',
        preview: false
      },
      {
        spotId: 2,    // hobbit house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/hobbit5.jpg',
        preview: false
      },
      {
        spotId: 3,    // totoro house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/totoro1.webp',
        preview: true
      },
      {
        spotId: 3,    // totoro house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/totoro2.webp',
        preview: false
      },
      {
        spotId: 3,    // totoro house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/totoro3.webp',
        preview: false
      },
      {
        spotId: 3,    // totoro house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/totoro4.jpg',
        preview: false
      },
      {
        spotId: 3,    // totoro house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/totoro5.webp',
        preview: false
      },
      {
        spotId: 4,    // shigol house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/shigol1.jpg',
        preview: true
      },
      {
        spotId: 4,    // shigol house
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/shigol2.jpg',
        preview: false
      },
      {
        spotId: 5,    // oprah's penthouse
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/oprah1.jpg',
        preview: true
      },
      {
        spotId: 6,    // modern mexican apt
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/mexican1.jpg',
        preview: true
      },
      {
        spotId: 7,    // bretman rock's neighbor
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/bretman1.jpg',
        preview: true
      },
      {
        spotId: 7,    // bretman rock's neighbor
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/bretman2.jpg',
        preview: false
      },
      {
        spotId: 7,    // bretman rock's neighbor
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/bretman3.jpg',
        preview: false
      },
      {
        spotId: 7,    // bretman rock's neighbor
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/bretman4.jpg',
        preview: false
      },
      {
        spotId: 7,    // bretman rock's neighbor
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/bretman5.jpg',
        preview: false
      },     
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options);
  }
};

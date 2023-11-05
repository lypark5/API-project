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
      {
        spotId: 8,    // L.A. Luxury Home
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/lalux1.webp',
        preview: true
      },  
      {
        spotId: 8,    // L.A. Luxury Home
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/lalux2.webp',
        preview: false
      }, 
      {
        spotId: 8,    // L.A. Luxury Home
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/lalux3.webp',
        preview: false
      },  
      {
        spotId: 8,    // L.A. Luxury Home
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/lalux4.webp',
        preview: false
      },  
      {
        spotId: 8,    // L.A. Luxury Home
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/lalux5.webp',
        preview: false
      }, 
      {
        spotId: 9,    // S.D. Waterfront Home
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/sd1.png',
        preview: true
      }, 
      {
        spotId: 9,    // S.D. Waterfront Home
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/sd2.png',
        preview: false
      }, 
      {
        spotId: 9,    // S.D. Waterfront Home
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/sd3.png',
        preview: false
      }, 
      {
        spotId: 9,    // S.D. Waterfront Home
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/sd4.png',
        preview: false
      }, 
      {
        spotId: 9,    // S.D. Waterfront Home
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/sd5.png',
        preview: false
      }, 
      {
        spotId: 10,    // Downton Abbey
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/downton1.jpg',
        preview: true
      }, 
      {
        spotId: 10,    // Downton Abbey
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/downton2.jpg',
        preview: false
      },
      {
        spotId: 10,    // Downton Abbey
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/downton3.jpg',
        preview: false
      },
      {
        spotId: 10,    // Downton Abbey
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/downton4.webp',
        preview: false
      },
      {
        spotId: 10,    // Downton Abbey
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/downton5.jpg',
        preview: false
      },
      {
        spotId: 11,    // Seoul Traditional Hanok
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/seoul1.webp',
        preview: true
      },
      {
        spotId: 11,    // Seoul Traditional Hanok
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/seoul2.webp',
        preview: false
      },
      {
        spotId: 11,    // Seoul Traditional Hanok
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/seoul3.webp',
        preview: false
      },
      {
        spotId: 11,    // Seoul Traditional Hanok
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/seoul4.webp',
        preview: false
      },
      {
        spotId: 11,    // Seoul Traditional Hanok
        url: 'https://airbnb-api-project.s3.us-east-2.amazonaws.com/seoul5.webp',
        preview: false
      },      
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options);
  }
};

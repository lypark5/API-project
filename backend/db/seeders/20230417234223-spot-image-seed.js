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
        url: 'https://www.reinhartrealtors.com/blog/wp-content/uploads/2014/06/3443-Haab-Rd-Ann-Arbor-MI.jpg',
        preview: true
      },
      {
        spotId: 2,    // hobbit house
        url: 'https://i.pinimg.com/736x/40/50/b9/4050b9014825ca4dbef3ad65cac9251e.jpg',
        preview: true
      },
      {
        spotId: 2,    // hobbit house
        url: 'https://i.pinimg.com/originals/ca/c3/fe/cac3fe07e91d18d20733b5d055ec02ea.jpg',
        preview: false
      },
      {
        spotId: 3,    // totoro house
        url: 'https://i0.wp.com/mscarefreetraveler.com/wp-content/uploads/2018/05/IMG_1046-e1525279633825.jpg?fit=640%2C480&ssl=1',
        preview: true
      },
      {
        spotId: 4,    // shigol house
        url: 'https://uujj.co.kr/data/editor/1505/thumb-94761d934f34276a1ae55c3572c7761f_1432706931_5214_600x467.jpg',
        preview: false
      },
      {
        spotId: 4,    // shigol house
        url: 'https://ncc-phinf.pstatic.net/20150817_171/1439799095509XJ5YL_JPEG/1.jpg?type=w646',
        preview: true
      },
      {
        spotId: 5,    // oprah's penthouse
        url: 'https://image.cnbcfm.com/api/v1/image/107123681-CPT-PH-STAIRCASE-spans-floors-129-131-Photo-Credit-Evan-Joseph.jpg?v=1663955462&w=1600&h=900',
        preview: true
      },
      {
        spotId: 6,    // modern mexican apt
        url: 'https://sanmiguelrealestate.com/pictures/large-view/10108-5297536752-san-miguel-real-estate.jpg',
        preview: true
      },
      {
        spotId: 7,    // bretman rock's neighbor
        url: 'https://images.estately.net/122_202021357_0_1598769042_636x435.jpg',
        preview: true
      },
      {
        spotId: 7,    // bretman rock's neighbor
        url: 'https://images.estately.net/122_202021357_3_1598769043_636x435.jpg',
        preview: false
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options);
  }
};

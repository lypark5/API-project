'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(options, [
      { 
        reviewId: 1,
        url: 'https://img.thedailybeast.com/image/upload/c_crop,d_placeholder_euli9k,h_1687,w_3000,x_0,y_0/dpr_1.5/c_limit,w_1600/fl_lossy,q_auto/v1585964709/200327-Gadre-TFW-NO-GF-_vyzbnj'
      },
      { 
        reviewId: 1,
        url: 'https://m.media-amazon.com/images/I/51zWI+MnGFL._AC_UF894,1000_QL80_.jpg'
      },
      { 
        reviewId: 2,
        url: 'https://m.media-amazon.com/images/I/51DEiRTz9vS._AC_UF1000,1000_QL80_.jpg'
      },
      { 
        reviewId: 2,
        url: 'https://c.files.bbci.co.uk/156E3/production/_103897778_npcwojak.jpg'
      },
      { 
        reviewId: 3,
        url: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg'
      },
      { 
        reviewId: 4,
        url: 'https://media.vanityfair.com/photos/5f5156490ca7fe28f9ec3f55/master/w_2560%2Cc_limit/feels-good-man-film.jpg'
      },
      { 
        reviewId: 5,
        url: 'https://www.gannett-cdn.com/presto/2021/01/13/PPHXS/7c17e567-2104-4596-b771-1b7621ece004-Cristian_Castro_sony_music.jpg'
      },
      { 
        reviewId: 5,
        url: 'https://pbs.twimg.com/media/CgadHTkW8AAMe8a.jpg'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options);
  }
};

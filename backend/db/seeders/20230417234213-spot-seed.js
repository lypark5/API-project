'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '2765 W. Harper St.',
        city: 'Odenton',
        state: 'MD',
        country: 'USA',
        lat: 39.08,
        lng: -76.70,
        name: 'Pebble House',     // 1
        description: 'If you feel small',
        price: 110.00
      },
      {
        ownerId: 2,
        address: '3445 W. Artwood Ave.',
        city: 'Portland',
        state: 'OR',
        country: 'USA',
        lat: -122.68,
        lng: 45.52,
        name: 'Hobbit House',     // 2
        description: 'A hole under a hill',
        price: 250.00
      },
      {
        ownerId: 3,
        address: '2257 W. Sumimasen Cir.',
        city: 'Yokosuka',
        state: 'Kanagawa',
        country: 'Japan',
        lat: 35.28,
        lng: 139.67,
        name: 'Totoro House',     // 3
        description: 'From the movie',
        price: 350.00
      },
      {
        ownerId: 4,
        address: '2825 E. Saranghae Dr.',
        city: 'Gumi',
        state: 'Gyeongsangbuk-do',
        country: 'S.Korea',
        lat: 36.06,
        lng: 128.20,
        name: 'Shigol House',     // 4
        description: "Grandma's house in the Korean countryside",
        price: 150.00
      },
      {
        ownerId: 5,
        address: '1885 E. Chicago Ave.',
        city: 'Chicago',
        state: 'Illinois',
        country: 'U.S.A.',
        lat: 41.88,
        lng: -87.62,
        name: "Oprah's Penthouse",    // 5
        description: "Luxurious penthouse overlooking downtown Chicago",
        price: 550.00
      },
      {
        ownerId: 1,
        address: '876 S. Tamale Dr.',
        city: 'Mexico City',
        state: 'D.F.',
        country: 'Mexico',
        lat: 19.43,
        lng: -99.13,
        name: 'Modern Mexican Apt',  // 6
        description: "Modern gated apartment in the heart of the city",
        price: 99.00
      },
      {
        ownerId: 4,
        address: '8844 S. Kaimuki Dr.',
        city: 'Honolulu',
        state: 'HI',
        country: 'U.S.A.',
        lat: 21.32,
        lng: -157.86,
        name: "Bretman Rock's neighbor",  // 7
        description: "House next to Bretman Rock's house",
        price: 375.00
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options);
  }
};

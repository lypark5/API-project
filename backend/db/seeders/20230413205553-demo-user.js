'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Demo',  // 1
        lastName: 'Lition',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Homer', // 2
        lastName: 'Simpson',
        email: 'cartoon@cartoon.io',
        username: 'AngryDad',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Tego',    // 3
        lastName: 'Calderon',
        email: 'afro@afro.io',
        username: 'PuroPerreo',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Spider',   // 4
        lastName: 'Man',
        email: 'spider@spider.io',
        username: 'Spiderman',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Peter',   // 5
        lastName: 'Parker',
        email: 'peter@peter.io',
        username: 'PumpkinEater',
        hashedPassword: bcrypt.hashSync('password5')
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'AngryDad', 'PuroPerreo', 'Spiderman', 'PumpkinEater'] }
    }, {});
  }
};
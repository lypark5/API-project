'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.SpotImage, {foreignKey: 'spotId'});     // 1 spot has many spot images
      Spot.belongsTo(models.User, {foreignKey: 'ownerId'});       // many spots have 1 user
      Spot.belongsToMany(models.User, {           // 1 spot can be booked by many users,
        through: models.Booking,                  // 1 user can book many spots.  many to many.
        foreignKey: 'spotId',
        otherKey: 'userId'
      }); 
      Spot.belongsToMany(models.User, {          // 1 spot can be reviewed by many users,
        through: models.Review,                  // 1 user can review many spots.  many to many.
        foreignKey: 'spotId',
        otherKey: 'userId'
      }); 
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
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
      Spot.belongsTo(models.User, {as: 'Owner', foreignKey: 'ownerId'});     // many spots have 1 owner  // added alias to use alias in Spots router
      Spot.hasMany(models.SpotImage, {foreignKey: 'spotId', hooks: true, onDelete: 'cascade'});   // 1 spot has many spot images
      Spot.hasMany(models.Review, {foreignKey: 'spotId', hooks: true, onDelete: 'cascade'});      // 1 spot has many reviews
      Spot.hasMany(models.Booking, {foreignKey: 'spotId', hooks: true, onDelete: 'cascade'});     // 1 spot has many bookings
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
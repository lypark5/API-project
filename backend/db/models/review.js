'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.hasMany(models.ReviewImage, {as: 'ReviewImages', foreignKey: 'reviewId', hooks: true, onDelete: 'cascade'});     // 1 review has many review images.
      Review.belongsTo(models.Spot, {foreignKey: 'spotId'});            // many reviews posted for 1 spot
      Review.belongsTo(models.User, {foreignKey: 'userId'});           // many reviews written by 1 user.
    }
  }
  Review.init({
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    review: DataTypes.STRING,
    stars: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
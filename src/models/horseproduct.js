'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class horseProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      horseProduct.belongsTo(models.user, {
        foreignKey: "userId",
        as: "userDetails",
        onDelete: "CASCADE"
      });
    }
  }
  horseProduct.init({
    userId: {
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    },
    titleLink: {
      type: DataTypes.STRING
    },
    actionIpAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'horseProduct',
  });
  return horseProduct;
};
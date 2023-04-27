'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sponsors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sponsors.init({
    userId: {
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    code: {
      type: DataTypes.STRING
    },
    fileName: {
      type: DataTypes.STRING
    },
    fileUrl: {
      type: DataTypes.STRING
    },
    actionIpAddress: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'sponsors',
  });
  return sponsors;
};
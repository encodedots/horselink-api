'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class countries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  countries.init({
    code: {
      type: DataTypes.STRING
    },

    iso: {
      type: DataTypes.STRING
    },

    name: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Name must be unique'
      }
    },

    isActive: {
      type: DataTypes.ENUM('y', 'n'),
      defaultValue: 'y',
    },

    isDeleted: {
      type: DataTypes.ENUM('y', 'n'),
      defaultValue: 'n',
    },

    actionIpAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'countries',
  });
  return countries;
};
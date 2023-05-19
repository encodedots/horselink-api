"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class contactManagement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  contactManagement.init(
    {
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      message: {
        type: DataTypes.TEXT
      },
      type: {
        type: DataTypes.STRING
      },
      actionIpAddress: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "contactManagement"
    }
  );
  return contactManagement;
};

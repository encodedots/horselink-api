"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class charity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  charity.init(
    {
      userName: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      charityName: {
        type: DataTypes.STRING
      },
      charityWebsite: {
        type: DataTypes.STRING
      },
      actionIpAddress: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "charity"
    }
  );
  return charity;
};

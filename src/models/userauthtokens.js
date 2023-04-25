"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userAuthTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  userAuthTokens.init(
    {
      email: {
        type: DataTypes.STRING
      },

      token: {
        type: DataTypes.STRING
      },

      status: {
        type: DataTypes.ENUM("y", "n"),
        defaultValue: "y"
      },
      actionIpAddress: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "userAuthTokens"
    }
  );
  return userAuthTokens;
};

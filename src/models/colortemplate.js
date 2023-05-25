"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class colorTemplate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  colorTemplate.init(
    {
      name: {
        type: DataTypes.STRING
      },
      code: {
        type: DataTypes.STRING
      },
      actionIpAddress: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "colorTemplate"
    }
  );
  return colorTemplate;
};

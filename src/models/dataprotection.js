"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dataProtection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  dataProtection.init(
    {
      fullName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      countryOfResidence: { type: DataTypes.STRING },
      horseLinkTo: { type: DataTypes.STRING },
      actionIpAddress: { type: DataTypes.STRING }
    },
    {
      sequelize,
      modelName: "dataProtection"
    }
  );
  return dataProtection;
};

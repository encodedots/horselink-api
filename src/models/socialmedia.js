"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class socialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  socialMedia.init(
    {
      name: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING },
      icon: { type: DataTypes.STRING },
      actionIpAddress: {
        type: DataTypes.STRING
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: "socialMedia"
    }
  );
  return socialMedia;
};

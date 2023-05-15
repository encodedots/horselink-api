"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class faqManagement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  faqManagement.init(
    {
      title: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.TEXT
      },
      status: {
        type: DataTypes.ENUM("y", "n"),
        defaultValue: "y"
      },
      module: {
        type: DataTypes.STRING
      },
      actionIpAddress: DataTypes.STRING,
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: "faqManagement",
      paranoid: true
    }
  );
  return faqManagement;
};

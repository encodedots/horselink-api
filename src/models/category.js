"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: "Please enter category"
        },
        unique: {
          args: true,
          msg: "Category must be unique"
        }
      },
      slug: {
        type: DataTypes.STRING
      },
      isActive: {
        type: DataTypes.ENUM("y", "n"),
        defaultValue: "y"
      },
      actionIpAddress: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "category"
    }
  );
  return category;
};

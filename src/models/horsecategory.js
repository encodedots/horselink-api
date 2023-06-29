'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class horseCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  horseCategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: "Please enter category"
        },
        unique: {
          args: true,
          msg: "Horse Category must be unique"
        }
      },
      slug: {
        type: DataTypes.STRING
      },
      type:{
        type: DataTypes.STRING
      },
      isActive: {
        type: DataTypes.ENUM("y", "n"),
        defaultValue: "y"
      },
      actionIpAddress: DataTypes.STRING
    }, {
    sequelize,
    modelName: 'horseCategory',
  });
  return horseCategory;
};
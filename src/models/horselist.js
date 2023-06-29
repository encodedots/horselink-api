'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class horseList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      horseList.belongsTo(models.user, {
        foreignKey: "userId",
        as: "userDetails",
        onDelete: "CASCADE"
      });

      // define association here
      horseList.belongsTo(models.horseCategory, {
        foreignKey: "horseCategoryId",
        as: "horseCategoryDetails",
        onDelete: "CASCADE"
      });
      // define association here
      horseList.belongsTo(models.horseCategory, {
      foreignKey: "horseSubCategoryId",
      as: "horseSubCategoryDetails",
      onDelete: "CASCADE"
      });
    }
  }
  horseList.init({
    userId: {
      type: DataTypes.INTEGER
    },
    horseCategoryId: {
      type: DataTypes.INTEGER
    },
    horseSubCategoryId:{
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    },
    titleLink: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    youtubeLink: {
      type: DataTypes.TEXT
    },
    youtubeEmbed: {
      type: DataTypes.TEXT
    },
    fileName: {
      type: DataTypes.STRING
    },
    fileUrl: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    link: {
      type: DataTypes.STRING
    },
    order: {
      type: DataTypes.INTEGER
    },
    actionIpAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'horseList',
  });
  return horseList;
};
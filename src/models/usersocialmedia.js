"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userSocialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userSocialMedia.belongsTo(models.socialMedia, {
        foreignKey: "socialMediaId",
        as: "socialMediaDetails",
        onDelete: "CASCADE"
      });
    }
  }
  userSocialMedia.init(
    {
      userId: {
        type: DataTypes.INTEGER
      },
      socialMediaId: {
        type: DataTypes.INTEGER
      },
      link: { type: DataTypes.STRING },
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
      modelName: "userSocialMedia"
    }
  );
  return userSocialMedia;
};

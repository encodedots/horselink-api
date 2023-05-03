"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsTo(models.category, {
        foreignKey: "categoryId",
        as: "categoryDetails",
        onDelete: "CASCADE"
      });

      user.belongsTo(models.colorTemplate, {
        foreignKey: "colorTemplateId",
        as: "colorTemplateDetails",
        onDelete: "CASCADE"
      });
    }
  }
  user.init(
    {
      webId: {
        type: DataTypes.STRING
      },

      firstName: {
        type: DataTypes.STRING
      },

      lastName: {
        type: DataTypes.STRING
      },

      userName: {
        type: DataTypes.STRING
      },

      userNameSlug: {
        type: DataTypes.STRING
      },

      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "Email must be unique"
        }
      },

      password: {
        type: DataTypes.STRING
      },

      description: {
        type: DataTypes.STRING
      },

      categoryId: {
        type: DataTypes.INTEGER
      },
      latitude: {
        type: DataTypes.STRING
      },
      longitude: {
        type: DataTypes.STRING
      },
      originalFileName: {
        type: DataTypes.STRING
      },

      originalFileUrl: {
        type: DataTypes.STRING
      },

      croppedFileName: {
        type: DataTypes.STRING
      },

      croppedFileUrl: {
        type: DataTypes.STRING
      },

      street: {
        type: DataTypes.STRING
      },

      town: {
        type: DataTypes.STRING
      },

      zipCode: {
        type: DataTypes.INTEGER
      },

      state: {
        type: DataTypes.STRING
      },

      country: {
        type: DataTypes.STRING
      },

      telephone: {
        type: DataTypes.BIGINT
      },

      mobileNumber: {
        type: DataTypes.STRING
      },
      tempEmail: {
        type: DataTypes.STRING
      },
      isNewsLetter: {
        type: DataTypes.ENUM("y", "n"),
        defaultValue: "n"
      },

      instagram: {
        type: DataTypes.STRING
      },

      facebook: {
        type: DataTypes.STRING
      },

      youtube: {
        type: DataTypes.STRING
      },

      tiktok: {
        type: DataTypes.STRING
      },

      website: {
        type: DataTypes.STRING
      },
      planName: {
        type: DataTypes.STRING
      },
      colorTemplateId: {
        type: DataTypes.INTEGER
      },
      resetPasswordToken: {
        type: DataTypes.STRING
      },
      signUpToken: {
        type: DataTypes.STRING
      },

      isActive: {
        type: DataTypes.ENUM("y", "n"),
        defaultValue: "y"
      },

      isDeleted: {
        type: DataTypes.ENUM("y", "n"),
        defaultValue: "n"
      },

      registerDate: {
        type: DataTypes.DATE
      },

      registerIP: {
        type: DataTypes.STRING
      },

      doiDate: {
        type: DataTypes.DATE
      },

      doiIP: {
        type: DataTypes.STRING
      },

      // registerType: {
      //   type: DataTypes.ENUM('private', 'business'),
      //   defaultValue: 'private',
      // },

      actionIpAddress: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "user",
      paranoid: true
    }
  );
  return user;
};

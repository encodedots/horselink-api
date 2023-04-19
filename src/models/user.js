'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  user.init({
    webId: {
      type: DataTypes.STRING,
    },

    firstName: {
      type: DataTypes.STRING,
    },

    lastName: {
      type: DataTypes.STRING,
    },

    userName: {
      type: DataTypes.STRING,
    },

    userNameSlug: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Email must be unique'
      }
    },

    password: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.STRING,
    },

    memberNumber: {
      type: DataTypes.STRING,
    },

    originalFileName: {
      type: DataTypes.STRING,
    },

    originalFileUrl: {
      type: DataTypes.STRING,
    },

    croppedFileName: {
      type: DataTypes.STRING,
    },

    croppedFileUrl: {
      type: DataTypes.STRING,
    },

    street: {
      type: DataTypes.STRING,
    },

    town: {
      type: DataTypes.STRING,
    },

    zipCode: {
      type: DataTypes.INTEGER,
    },

    state: {
      type: DataTypes.STRING,
    },

    country: {
      type: DataTypes.STRING,
    },

    telephone: {
      type: DataTypes.BIGINT,
    },

    mobileNumber: {
      type: DataTypes.STRING,
    },

    isNewsLetter: {
      type: DataTypes.ENUM('y', 'n'),
      defaultValue: 'n',
    },

    allowMessage: {
      type: DataTypes.ENUM('y', 'n'),
      defaultValue: 'n',
    },

    instagram: {
      type: DataTypes.STRING,
    },

    facebook: {
      type: DataTypes.STRING,
    },

    youtube: {
      type: DataTypes.STRING,
    },

    tiktok: {
      type: DataTypes.STRING,
    },

    website: {
      type: DataTypes.STRING,
    },

    resetPasswordToken: {
      type: DataTypes.STRING
    },

    emailVerificationCode: {
      type: DataTypes.STRING,
    },

    passwordVerificationCode: {
      type: DataTypes.STRING,
    },

    signUpToken: {
      type: DataTypes.STRING,
    },

    // status y when click on the confirm of register mail otherwise n
    status: {
      type: DataTypes.ENUM('y', 'n'),
      defaultValue: 'n',
    },

    isActive: {
      type: DataTypes.ENUM('y', 'n'),
      defaultValue: 'y',
    },

    isDeleted: {
      type: DataTypes.ENUM('y', 'n'),
      defaultValue: 'n',
    },

    registerDate: {
      type: DataTypes.DATE,
    },

    registerIP: {
      type: DataTypes.STRING,
    },

    doiDate: {
      type: DataTypes.DATE,
    },

    doiIP: {
      type: DataTypes.STRING,
    },

    // registerType: {
    //   type: DataTypes.ENUM('private', 'business'),
    //   defaultValue: 'private',
    // },

    actionIpAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    paranoid: true
  });
  return user;
};
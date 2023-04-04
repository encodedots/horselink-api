'use strict';
const { Model } = require('sequelize');
import Random from '../utils/random'
import { hash } from "../utils/hashing";

module.exports = (sequelize, DataTypes) => {
  class adminUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  adminUser.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please enter your name',
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please enter your email address',
        },
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address',
        },
      },
    },

    password: DataTypes.STRING,

    resetPasswordToken: DataTypes.STRING,

    isActive: {
      type: DataTypes.ENUM('y', 'n'),
      defaultValue: 'y',
    },

    isDeleted: {
      type: DataTypes.ENUM('y', 'n'),
      defaultValue: 'n',
    },

    last_login_at: DataTypes.DATE,

    actionIpAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'adminUser',
  });

  /**
   * Create a new personal access token for the user.
   *
   * @return Object
   * @param device_name
   */
  // adminUser.prototype.newToken = async function newToken(device_name = 'Web FE') {
  //   const plainTextToken = Random(40);

  //   return plainTextToken;
  // };

  return adminUser;
};
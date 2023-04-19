'use strict';

import {hash} from '../../utils/hashing';
import model from '../../models';
import Constants from '../../utils/constants';

const {adminUser} = model;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const createAdminUser = await adminUser.create({
      name: Constants.ADMIN_USER_NAME,
      email: Constants.ADMIN_USER_EMAIL,
      password: hash(Constants.ADMIN_USER_PASSWORD)
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

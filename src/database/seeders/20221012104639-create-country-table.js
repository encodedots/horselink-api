'use strict';
import model from '../../models';
const {countries} = model;

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

    /**
     * Summary: This is bulk create for countries.
     */
    await countries.bulkCreate([
      { code: '+1', iso: 'US', name: 'America' },
      { code: '+1', iso: 'CA', name: 'Canada' },
      { code: '+61', iso: 'AU', name: 'Australia' },
      { code: '+64', iso: 'NZ', name: 'New Zealand' },
      { code: '+353', iso: 'IE', name: 'Ireland' },
      { code: '+44', iso: 'GB', name: 'England' },
      { code: '+48', iso: 'PL', name: 'Poland' },
      { code: '+47', iso: 'NO', name: 'Norway' },
      { code: '+358', iso: 'FI', name: 'Finland' },
      { code: '+46', iso: 'SE', name: 'Sweden' },
      { code: '+31', iso: 'NL', name: 'Netherlands' },
      { code: '+49', iso: 'DE', name: 'Germany' },
      { code: '+33', iso: 'FR', name: 'France' },
      { code: '+39', iso: 'IT', name: 'Italy' },
      { code: '+34', iso: 'ES', name: 'Spain' },
      { code: '+352', iso: 'LU', name: 'Luxembourg' },
      { code: '+43', iso: 'AT', name: 'Austria' },
      { code: '+41', iso: 'CH', name: 'Switzerland' },
      { code: '+370', iso: 'LT', name: 'Lithuania' },
      { code: '+420', iso: 'CZ', name: 'Czech Republic' },
      { code: '+45', iso: 'DK', name: 'Denmark' },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await countries.destroy();
  }
};

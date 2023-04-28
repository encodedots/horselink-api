"use strict";
import model from "../../models";
const { socialMedia } = model;
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
    await socialMedia.bulkCreate([
      { name: "Instagram", slug: "instagram", icon: "https://www.google.com/" },
      { name: "Facebook", slug: "facebook", icon: "https://www.google.com/" },
      { name: "Whatsapp", slug: "whatsapp", icon: "https://www.google.com/" },
      { name: "Twitter", slug: "twitter", icon: "https://www.google.com/" },
      { name: "LinkedIn", slug: "linkedin", icon: "https://www.google.com/" }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await socialMedia.destroy();
  }
};

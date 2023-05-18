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
      { name: "Instagram", slug: "instagram", icon: "https://horse-link.s3.ap-south-1.amazonaws.com/socialMedia/Instagram.svg" },
      { name: "Facebook", slug: "facebook", icon: "https://horse-link.s3.ap-south-1.amazonaws.com/socialMedia/Facebook.svg" },
      { name: "Whatsapp", slug: "whatsapp", icon: "https://horse-link.s3.ap-south-1.amazonaws.com/socialMedia/whatsapp.png" },
      { name: "Twitter", slug: "twitter", icon: "https://horse-link.s3.ap-south-1.amazonaws.com/socialMedia/twitter.png" },
      { name: "LinkedIn", slug: "linkedin", icon: "https://horse-link.s3.ap-south-1.amazonaws.com/socialMedia/linkedin.png" },
      { name: "Horse-Link", slug: "linkedin", icon: "https://horse-link.s3.ap-south-1.amazonaws.com/socialMedia/horselink-round.svg" }
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

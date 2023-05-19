"use strict";
import model from "../../models";
const { category } = model;
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
    await category.bulkCreate([
      { name: "Rider", slug: "rider" },
      { name: "Stable", slug: "stable" },
      { name: "Breeder", slug: "breeder" },
      { name: "Brand", slug: "brand" },
      { name: "Business", slug: "business" },
      { name: "Association", slug: "association" },
      { name: "Health", slug: "health" },
      { name: "Influencer", slug: "influencer" }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await category.destroy();
  }
};

"use strict";
import model from "../../models";
const { colorTemplate } = model;
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
    await colorTemplate.bulkCreate([
      { name: "Black", code: "#000000" },
      { name: "White", code: "#FFFFFF" },
      { name: "Transparent", code: "#FFFFFF00" },
      { name: "Orange", code: "#FA6800" },
      { name: "Pink", code: "#fcdbeacc" }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await colorTemplate.destroy();
  }
};

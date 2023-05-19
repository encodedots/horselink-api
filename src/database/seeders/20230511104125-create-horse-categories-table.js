'use strict';
import model from "../../models";
const { horseCategory } = model;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
    */
    await horseCategory.bulkCreate([
      { name: "Foals", slug: "foals" },
      { name: "Yearlings", slug: "yearlings" },
      { name: "Unbroken", slug: "unbroken" },
      { name: "Riding", slug: "riding" },
      { name: "Mares", slug: "mares" },
      { name: "Stallions", slug: "stallions" },
      { name: "Dressage", slug: "dressage" },
      { name: "Show Jumping", slug: "show-jumping" },
      { name: "Eventing", slug: "eventing" },
      { name: "Racing", slug: "racing" },
      { name: "Other", slug: "other" }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await horseCategory.destroy();
  }
};

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
      { name: "Dressage", slug: "dressage" , type:"main" },
      { name: "Eventing", slug: "eventing", type:"main" },
      { name: "Foals", slug: "foals" , type:"sub"},
      { name: "Mares", slug: "mares" , type:"sub"},
      { name: "Other", slug: "other" , type:"main" },
      { name: "Racing", slug: "racing", type:"main" },
      { name: "Riding", slug: "riding" , type:"sub" },
      { name: "Show Jumping", slug: "show-jumping", type:"main" },
      { name: "Stallions", slug: "stallions" , type:"sub" },
      { name: "Unbroken", slug: "unbroken" , type:"sub" },
      { name: "Yearlings", slug: "yearlings" , type:"sub" }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await horseCategory.destroy();
  }
};

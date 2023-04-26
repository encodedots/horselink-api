'use strict';
import model from '../../models';
const { userType } = model;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Summary: This is bulk create for user types
     */
    await userType.bulkCreate([
      { name: 'Rider', slug: 'rider' },
      { name: 'Stable', slug: 'stable' },
      { name: 'Breeder', slug: 'breeder' },
      { name: 'Brand', slug: 'brand' },
      { name: 'Business', slug: 'business' },
      { name: 'Association', slug: 'association' },
      { name: 'Health', slug: 'health' },
      { name: 'Influencer', slug: 'influencer' }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Summary: This is delete for user types
     */
    await userType.destroy();
  }
};

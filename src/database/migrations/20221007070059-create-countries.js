'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('countries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING
      },

      iso: {
        type: Sequelize.STRING
      },

      name: {
        type: Sequelize.STRING,
        unique: true
      },

      isActive: {
        type: Sequelize.ENUM,
        values: ['y', 'n'],
        defaultValue: 'y',
      },

      isDeleted: {
        type: Sequelize.ENUM,
        values: ['y', 'n'],
        defaultValue: 'n',
      },

      actionIpAddress: {
        type: Sequelize.STRING
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('countries');
  }
};
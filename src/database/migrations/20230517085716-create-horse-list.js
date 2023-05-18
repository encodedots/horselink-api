'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('horseLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      horseCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "horseCategories",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      title: {
        type: Sequelize.STRING
      },
      titleLink: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      youtubeLink: {
        type: Sequelize.TEXT
      },
      youtubeEmbed: {
        type: Sequelize.TEXT
      },
      fileName: {
        type: Sequelize.STRING
      },
      fileUrl: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER
      },
      actionIpAddress: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('horseLists');
  }
};
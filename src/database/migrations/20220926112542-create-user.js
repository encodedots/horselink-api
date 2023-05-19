"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      webId: {
        type: Sequelize.STRING
      },

      firstName: {
        type: Sequelize.STRING
      },

      lastName: {
        type: Sequelize.STRING
      },

      userName: {
        type: Sequelize.STRING,
        allowNull: true
      },

      userNameSlug: {
        type: Sequelize.STRING,
        allowNull: true
      },

      email: {
        type: Sequelize.STRING
      },

      password: {
        type: Sequelize.STRING
      },

      description: {
        type: Sequelize.STRING,
        allowNull: true
      },

      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "categories",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      originalFileName: {
        type: Sequelize.STRING,
        allowNull: true
      },

      originalFileUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },

      croppedFileName: {
        type: Sequelize.STRING,
        allowNull: true
      },

      croppedFileUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      backgroundOriginalFileName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      backgroundOriginalFileUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      backgroundCroppedFileName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      backgroundCroppedFileUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      street: {
        type: Sequelize.STRING,
        allowNull: true
      },

      town: {
        type: Sequelize.STRING,
        allowNull: true
      },

      zipCode: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      state: {
        type: Sequelize.STRING,
        allowNull: true
      },

      country: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "countries",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },

      telephone: {
        type: Sequelize.BIGINT,
        allowNull: true
      },

      mobileNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tempEmail: {
        type: Sequelize.STRING
      },
      isNewsLetter: {
        type: Sequelize.ENUM,
        values: ["y", "n"],
        defaultValue: "n"
      },

      instagram: {
        type: Sequelize.STRING
      },

      facebook: {
        type: Sequelize.STRING
      },

      youtube: {
        type: Sequelize.STRING
      },

      tiktok: {
        type: Sequelize.STRING
      },

      website: {
        type: Sequelize.STRING
      },
      planName: {
        type: Sequelize.STRING
      },
      colorTemplateId: {
        type: Sequelize.INTEGER,
        references: {
          model: "colorTemplates",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      resetPasswordToken: {
        type: Sequelize.STRING
      },

      signUpToken: {
        type: Sequelize.STRING
      },

      isActive: {
        type: Sequelize.ENUM,
        values: ["y", "n"],
        defaultValue: "y"
      },
      status: {
        type: Sequelize.ENUM("y", "n"),
        defaultValue: "n"
      },

      isDeleted: {
        type: Sequelize.ENUM,
        values: ["y", "n"],
        defaultValue: "n"
      },

      registerDate: {
        type: Sequelize.DATE
      },

      registerIP: {
        type: Sequelize.STRING
      },

      doiDate: {
        allowNull: true,
        type: Sequelize.DATE
      },

      doiIP: {
        allowNull: true,
        type: Sequelize.STRING
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductTags',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        productId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Products',
            key: 'id',
          }
        },
        searchTags: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        isDeleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      });
    await queryInterface.addConstraint('ProductTags', {
      fields: ['productId', 'searchTags'],
      type: 'unique',
      name: 'unique_products_search_tags'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductTags');
    await queryInterface.removeConstraint('ProductTags', 'unique_products_search_tags')
  }
};

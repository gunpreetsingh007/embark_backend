'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex('Products', ['productName'])
    await queryInterface.addIndex('Products', ['fragranceId'])
    await queryInterface.addIndex('Hierarchies', ['hierarchyName'])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Products', ['productName'])
    await queryInterface.removeIndex('Products', ['fragranceId'])
    await queryInterface.removeIndex('Hierarchies', ['hierarchyName'])
  }
};

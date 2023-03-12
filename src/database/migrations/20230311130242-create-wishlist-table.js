'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Wishlists', 
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
        as: 'productId'
      }
     },
     userId: { 
      type: Sequelize.UUID, 
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
     },
     attributeCombination: {
      type: Sequelize.JSON,
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Wishlists');
  }
};

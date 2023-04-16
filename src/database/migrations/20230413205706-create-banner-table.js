'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Banners', 
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
     productAttributeId: { 
      type: Sequelize.UUID, 
      allowNull: false
     },
     type: {
      type: Sequelize.STRING, 
      allowNull: false
     },
     imageJson: { 
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
    await queryInterface.dropTable('Banners');
  }
};

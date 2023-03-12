'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Products', 
    { 
     id: { 
       type: Sequelize.UUID, 
       primaryKey: true, 
       defaultValue: Sequelize.UUIDV4 
     },
     productName: { 
       type: Sequelize.STRING, 
       allowNull: false
     },
     productDescription: { 
       type: Sequelize.TEXT, 
       allowNull: true
     },
     productPrice: {
       type: Sequelize.INTEGER,
       allowNull: false
     },
     productDiscountPrice: {
      type: Sequelize.INTEGER,
      allowNull: false
     },
     attributeCombination: {
      type: Sequelize.JSON,
      allowNull: false
     },
     pictureUrl: {
      type: Sequelize.STRING,
      allowNull: false
     },
     rating: { 
       type: Sequelize.FLOAT, 
       defaultValue: 0.0
     },
     isActive: { 
       type: Sequelize.BOOLEAN, 
       defaultValue: true
     },
     hierarchyId: { 
      type: Sequelize.UUID, 
      allowNull: false,
      references: {
        model: 'Hierarchies',
        key: 'id',
        as: 'hierarchyId'
      }
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
    await queryInterface.dropTable('Products');
  }
};

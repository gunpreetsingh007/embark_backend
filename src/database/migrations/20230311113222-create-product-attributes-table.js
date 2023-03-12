'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ProductAttributes', 
    { 
     id: { 
       type: Sequelize.UUID, 
       primaryKey: true, 
       defaultValue: Sequelize.UUIDV4 
     },
     attributeName: { 
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductAttributes');
  }
};

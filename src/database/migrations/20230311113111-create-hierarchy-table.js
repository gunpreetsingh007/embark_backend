'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Hierarchies', 
    { 
     id: { 
       type: Sequelize.UUID, 
       primaryKey: true, 
       defaultValue: Sequelize.UUIDV4 
     },
     hierarchyName: { 
       type: Sequelize.STRING, 
       allowNull: false
     },
     hierarchyLevel: { 
       type: Sequelize.INTEGER, 
       allowNull: false
     },
     parentId: { 
      type: Sequelize.UUID, 
      allowNull: true,
      references: {
        model: 'Hierarchies',
        key: 'id',
        as: 'parentId'
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
    await queryInterface.dropTable('Hierarchies');
  }
};

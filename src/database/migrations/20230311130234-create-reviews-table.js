'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', 
    { 
     id: { 
       type: Sequelize.UUID, 
       primaryKey: true, 
       defaultValue: Sequelize.UUIDV4 
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
     productId: { 
      type: Sequelize.UUID, 
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
        as: 'productId'
      }
     },
     reviewText: { 
       type: Sequelize.TEXT, 
       allowNull: false
     },
     rating: { 
      type: Sequelize.FLOAT, 
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
    await queryInterface.dropTable('Reviews');
  }
};

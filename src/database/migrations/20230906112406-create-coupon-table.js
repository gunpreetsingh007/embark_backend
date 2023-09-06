'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Coupons', 
    { 
     id: { 
       type: Sequelize.UUID, 
       primaryKey: true, 
       defaultValue: Sequelize.UUIDV4 
     },
     couponName: { 
      type: Sequelize.STRING, 
      allowNull: false,
     },
     couponValue: { 
      type: Sequelize.INTEGER, 
      allowNull: false
     },
     products: { 
      type: Sequelize.JSON, 
      allowNull: true
     },
     isValidOneTime: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
     },
     expiryDate: { 
      type: Sequelize.DATE, 
      allowNull: true 
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
    await queryInterface.dropTable('Coupons');
  }
};

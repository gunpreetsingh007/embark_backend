'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CouponAssignments', 
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
     orderId: { 
      type: Sequelize.BIGINT, 
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id',
        as: 'orderId'
      }
     },
     couponId: { 
      type: Sequelize.UUID, 
      allowNull: false,
      references: {
        model: 'Coupons',
        key: 'id',
        as: 'couponId'
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
    await queryInterface.dropTable('CouponAssignments');
  }
};

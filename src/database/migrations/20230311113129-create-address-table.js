'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Addresses', 
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
     addressType: { 
      type: Sequelize.STRING, 
      allowNull: false
     },
     firstName: { 
       type: Sequelize.STRING, 
       allowNull: false
     },
     lastName: { 
      type: Sequelize.STRING, 
      allowNull: false
    },
     companyName: { 
       type: Sequelize.STRING, 
       allowNull: true
     },
     country: {
       type: Sequelize.STRING,
       allowNull: false
     },
     streetAddress: {
      type: Sequelize.STRING,
      allowNull: false
     },
     apartment: {
      type: Sequelize.STRING,
      allowNull: false
     },
     city: {
      type: Sequelize.STRING,
      allowNull: false
     },
     state: {
      type: Sequelize.STRING,
      allowNull: false
     },
     pincode: { 
       type: Sequelize.INTEGER, 
       allowNull: false
     },
     contact: { 
       type: Sequelize.STRING, 
       allowNull: false
     },
     email: { 
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
    await queryInterface.dropTable('Addresses');
  }
};

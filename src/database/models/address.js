module.exports = function(sequelize, Sequelize) {
    var AddressSchema = sequelize.define('Address', { 
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
        gstNumber: { 
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
        landmark: {
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
        stateId:{
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
    AddressSchema.associate = models => { 
        AddressSchema.belongsTo(models.User, { foreignKey: 'userId', });
    }
    return AddressSchema;
}
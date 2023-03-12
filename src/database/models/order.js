module.exports = function(sequelize, Sequelize) {
    var OrderSchema = sequelize.define('Order', { 
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
        addressId: { 
         type: Sequelize.UUID, 
         allowNull: false,
         references: {
           model: 'Addresses',
           key: 'id',
           as: 'addressId'
         }
        },
        orderDetails: { 
          type: Sequelize.JSON, 
          allowNull: false
        },
        orderToken: { 
          type: Sequelize.STRING, 
          allowNull: false
        },
        orderNotes: {
          type: Sequelize.STRING,
          allowNull: true
        },
        paymentMethod: {
         type: Sequelize.STRING,
         allowNull: false
        },
        orderAmount: {
         type: Sequelize.INTEGER,
         allowNull: false
        },
        orderStatus: {
         type: Sequelize.STRING,
         allowNull: false
        },
        placedAt: { 
         type: Sequelize.DATE, 
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
    OrderSchema.associate = models => { 
        OrderSchema.belongsTo(models.User, { foreignKey: 'userId', });
        OrderSchema.belongsTo(models.Address, { foreignKey: 'addressId', });
    }
    return OrderSchema;
}
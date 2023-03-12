module.exports = function(sequelize, Sequelize) {
    var CartSchema = sequelize.define('Cart', { 
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
           as: 'productId'
         }
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
        attributeCombination: {
         type: Sequelize.JSON,
         allowNull: false
        },
        quantity: {
          type: Sequelize.INTEGER,
          defaultValue: 1
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
    CartSchema.associate = models => { 
        CartSchema.belongsTo(models.User, { foreignKey: 'userId', });
        CartSchema.belongsTo(models.Product, { foreignKey: 'productId', });
    }
    return CartSchema;
}
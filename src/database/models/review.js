module.exports = function(sequelize, Sequelize) {
    var ReviewSchema = sequelize.define('Review', { 
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
    ReviewSchema.associate = models => { 
        ReviewSchema.belongsTo(models.User, { foreignKey: 'userId', });
        ReviewSchema.belongsTo(models.Product, { foreignKey: 'productId', });
    }
    return ReviewSchema;
}
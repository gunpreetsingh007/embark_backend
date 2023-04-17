module.exports = function(sequelize, Sequelize) {
    var WishlistSchema = sequelize.define('Wishlist',   { 
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
        productAttributeId: {
         type: Sequelize.UUID,
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
    WishlistSchema.associate = models => { 
        WishlistSchema.belongsTo(models.User, { foreignKey: 'userId', });
        WishlistSchema.belongsTo(models.Product, { foreignKey: 'productId', });
    }
    return WishlistSchema;
}
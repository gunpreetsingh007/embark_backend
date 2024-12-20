module.exports = function(sequelize, Sequelize) {
    var ProductSchema = sequelize.define('Product', { 
        id: { 
          type: Sequelize.UUID, 
          primaryKey: true, 
          defaultValue: Sequelize.UUIDV4 
        },
        productName: { 
          type: Sequelize.STRING, 
          allowNull: false
        },
        productDescription: { 
          type: Sequelize.TEXT, 
          allowNull: true
        },
        noteStory: {
          type: Sequelize.JSON,
          allowNull: false
         },
        productDetails: {
          type: Sequelize.JSON,
          allowNull: false
         },
        fragranceId: {
          type: Sequelize.UUID, 
          allowNull: true,
          references: {
            model: 'Fragrances',
            key: 'id'
          }
        },
        isActive: { 
          type: Sequelize.BOOLEAN, 
          defaultValue: true
        },
        hierarchyId: { 
         type: Sequelize.UUID, 
         allowNull: false,
         references: {
           model: 'Hierarchies',
           key: 'id',
           as: 'hierarchyId'
         }
        },
        gender: { 
          type: Sequelize.STRING, 
          allowNull: false
        },
        isGiftSetBox: { 
          type: Sequelize.BOOLEAN, 
          defaultValue: false
        },
        bestSellerStatus: { 
          type: Sequelize.BOOLEAN, 
          defaultValue: false
        },
        hsnNumber: { 
          type: Sequelize.INTEGER, 
          defaultValue: false
        },
        isNew: { 
          type: Sequelize.BOOLEAN, 
          defaultValue: false
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
    ProductSchema.associate = models => { 
        ProductSchema.belongsTo(models.Fragrance, { foreignKey: 'fragranceId', });
        ProductSchema.belongsTo(models.Hierarchy, { foreignKey: 'hierarchyId', });
        ProductSchema.hasMany(models.Review, { foreignKey: 'productId', });
        ProductSchema.hasMany(models.ProductTag, { foreignKey: 'productId', });
    }
    return ProductSchema;
}
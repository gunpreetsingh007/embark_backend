module.exports = function(sequelize, Sequelize) {
    var ProductAttributeSchema = sequelize.define('ProductAttribute', { 
        id: { 
          type: Sequelize.UUID, 
          primaryKey: true, 
          defaultValue: Sequelize.UUIDV4 
        },
        attributeName: { 
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
    return ProductAttributeSchema;
}
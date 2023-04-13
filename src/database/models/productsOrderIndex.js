module.exports = function(sequelize, Sequelize) {
    var ProductsOrderIndexSchema = sequelize.define('ProductsOrderIndex', { 
        id: { 
          type: Sequelize.UUID, 
          primaryKey: true, 
          defaultValue: Sequelize.UUIDV4 
        },
        productsOrderJson: {
          type: Sequelize.JSON,
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
    }, {tableName: "ProductsOrderIndexes"});
    return ProductsOrderIndexSchema;
}
module.exports = function (sequelize, Sequelize) {
    var ProductTagSchema = sequelize.define('ProductTag', {
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
            }
        },
        searchTags: {
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
    ProductTagSchema.associate = models => {
        ProductTagSchema.belongsTo(models.Product, { foreignKey: 'productId', });
    }
    return ProductTagSchema;
}
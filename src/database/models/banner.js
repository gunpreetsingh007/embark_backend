module.exports = function (sequelize, Sequelize) {
    var BannerSchema = sequelize.define('Banner', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        productLink: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        imageJson: {
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
    });
    BannerSchema.associate = models => {
        BannerSchema.belongsTo(models.Product, { foreignKey: 'productId', });
    }
    return BannerSchema;
}
module.exports = function (sequelize, Sequelize) {
    var FragranceSchema = sequelize.define('Fragrance', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        fragranceName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fragrancePictureUrl: {
            type: Sequelize.TEXT,
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
    return FragranceSchema;
}
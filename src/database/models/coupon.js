module.exports = function (sequelize, Sequelize) {
    var CouponSchema = sequelize.define('Coupon', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        couponName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        couponValue: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        products: {
            type: Sequelize.JSON,
            allowNull: true
        },
        isValidOneTime: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        expiryDate: {
            type: Sequelize.DATE,
            allowNull: true
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
    return CouponSchema;
}
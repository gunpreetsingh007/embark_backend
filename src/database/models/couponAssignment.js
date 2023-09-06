module.exports = function (sequelize, Sequelize) {
    var CouponAssignment = sequelize.define('CouponAssignment', {
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
        orderId: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: 'Orders',
                key: 'id',
                as: 'orderId'
            }
        },
        couponId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Coupons',
                key: 'id',
                as: 'couponId'
            }
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
    CouponAssignment.associate = models => {
        CouponAssignment.belongsTo(models.User, { foreignKey: 'userId', });
        CouponAssignment.belongsTo(models.Order, { foreignKey: 'orderId', });
        CouponAssignment.belongsTo(models.Coupon, { foreignKey: 'couponId', });
    }
    return CouponAssignment;
}
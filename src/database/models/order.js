module.exports = function (sequelize, Sequelize) {
  var OrderSchema = sequelize.define('Order', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
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
    addressDetails: {
      type: Sequelize.JSON,
      allowNull: false
    },
    orderDetails: {
      type: Sequelize.JSON,
      allowNull: false
    },
    razorpayDetails: {
      type: Sequelize.JSON,
      allowNull: true
    },
    shiprocketOrderId: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    totalItems: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    orderToken: {
      type: Sequelize.STRING,
      allowNull: false
    },
    orderNotes: {
      type: Sequelize.STRING,
      allowNull: true
    },
    paymentMethod: {
      type: Sequelize.STRING,
      allowNull: false
    },
    orderAmount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    orderAmountWithoutDiscount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    deliveryCharges: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    orderTotalAmount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    orderStatus: {
      type: Sequelize.STRING,
      allowNull: false
    },
    invoiceId: {
      type: Sequelize.JSON,
      allowNull: true
    },
    purchaseCount: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    failureReason: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    placedAt: {
      type: Sequelize.DATE,
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
  OrderSchema.associate = models => {
    OrderSchema.belongsTo(models.User, { foreignKey: 'userId', });
    OrderSchema.hasOne(models.CouponAssignment, {foreignKey: "orderId"});
  }
  return OrderSchema;
}
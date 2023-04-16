module.exports = function (sequelize, Sequelize) {
  var ReviewSchema = sequelize.define('Review', {
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
    productAttributeId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    reviewTitle: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    reviewText: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    reviewPictures: {
      type: Sequelize.JSON,
      allowNull: true
    },
    rating: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    isApproved: {
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
  ReviewSchema.associate = models => {
    ReviewSchema.belongsTo(models.Product, { foreignKey: 'productId', });
  }
  return ReviewSchema;
}
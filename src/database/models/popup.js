module.exports = function (sequelize, Sequelize) {
    var PopupSchema = sequelize.define('Popup', { 
        id: { 
          type: Sequelize.UUID, 
          primaryKey: true, 
          defaultValue: Sequelize.UUIDV4 
        },
        minimumAmount: { 
         type: Sequelize.INTEGER, 
         allowNull: false,
        },
        image: { 
         type: Sequelize.JSON, 
         allowNull: false
        },
        products: { 
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
    return PopupSchema;
}
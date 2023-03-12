module.exports = function(sequelize, Sequelize) {
    var UserSchema = sequelize.define('User',  { 
        id: { 
          type: Sequelize.UUID, 
          primaryKey: true, 
          defaultValue: Sequelize.UUIDV4 
        },
        firstName: { 
          type: Sequelize.STRING, 
          allowNull: true
        },
        lastName: { 
         type: Sequelize.STRING, 
         allowNull: true
        },
        username: { 
         type: Sequelize.STRING, 
         allowNull: false,
         unique: true
        },
        email: { 
          type: Sequelize.STRING, 
          allowNull: false, 
          unique: true
        },
        password: { 
          type: Sequelize.TEXT, 
          allowNull: false
        },
        fcmToken: { 
          type: Sequelize.TEXT, 
          allowNull: true
        },
        role: { 
          type: Sequelize.STRING, 
          allowNull: false
        },
        isActive: { 
          type: Sequelize.BOOLEAN,
          defaultValue: true
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
    UserSchema.associate = models => { 
        UserSchema.hasMany(models.Cart, { foreignKey: 'userId', });
        UserSchema.hasMany(models.Address, { foreignKey: 'userId', });
        UserSchema.hasMany(models.Order, { foreignKey: 'userId', });
        UserSchema.hasMany(models.Wishlist, { foreignKey: 'userId', });
        UserSchema.hasMany(models.Review, { foreignKey: 'userId', });
    }
    return UserSchema;
}
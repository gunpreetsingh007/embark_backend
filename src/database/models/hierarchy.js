module.exports = function(sequelize, Sequelize) {
    var HierarchySchema = sequelize.define('Hierarchy',  { 
        id: { 
          type: Sequelize.UUID, 
          primaryKey: true, 
          defaultValue: Sequelize.UUIDV4 
        },
        hierarchyName: { 
          type: Sequelize.STRING, 
          allowNull: false
        },
        hierarchyLevel: { 
          type: Sequelize.INTEGER, 
          allowNull: false
        },
        parentId: { 
         type: Sequelize.UUID, 
         allowNull: true,
         references: {
           model: 'Hierarchies',
           key: 'id',
           as: 'parentId'
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
    HierarchySchema.associate = models => { 
        HierarchySchema.belongsTo(models.Hierarchy, { foreignKey: 'parentId', });
    }
    return HierarchySchema;
}
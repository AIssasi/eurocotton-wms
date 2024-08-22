const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');

class Inventory extends Model {}

Inventory.init({
    id_inventory:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    product_inventory:{
        type:DataTypes.INTEGER,
        allowNull: false,
        validate:{
            len:[1,10]
        },
        references:{
            model: Product,
            key: 'id_product'
          }
    },
    quantity_inventory:{ 
        type:DataTypes.INTEGER,
        allowNull: false,
        validate:{
            len:[1,10]
        }
    },
    warehouse_inventory:{
        type:DataTypes.INTEGER,
        allowNull: false,
        validate:{
            len:[1,10]
        }
    },

},{
    sequelize,
    modelName:'Inventory',
    tableName:'Inventories',
    timestamps: true,
    underscored: true
});

module.exports = Inventory
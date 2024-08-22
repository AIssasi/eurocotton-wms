const sequelize = require('../config/database'); // Importar la instancia de Sequelize

const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePerm = require('./rolePerm');
const Product = require('./Product');
const Brand = require('./Brand');
const Category = require('./Category');
const Composition = require('./Composition');
const Color = require('./Color');
const State = require('./State');
const Warehouse = require('./Warehouse');
const Provider = require('./Provider');
const Order = require('./Order');
const orderType = require('./orderType');
const Movement = require('./Movement');

const initModels = () => {
    // Definir relaciones
    User.belongsTo(Role, { foreignKey: 'role_user', as: 'role' });
    Role.hasMany(User, { foreignKey: 'role_user' });

    Product.belongsTo(Brand, {foreignKey: 'brand_product', as: 'brand' });
    Brand.hasMany(Product, {foreignKey: 'brand_product' });
      
    Product.belongsTo(Category, {foreignKey: 'category_product', as: 'category' });
    Category.hasMany(Product, {foreignKey: 'category_product' });

    Product.belongsTo(Composition, {foreignKey: 'composition_product', as: 'composition' });
    Composition.hasMany(Product, {foreignKey: 'composition_product' });

    Product.belongsTo(Color, {foreignKey: 'color_product', as: 'color' });
    Color.hasMany(Product, {foreignKey: 'color_product' });

    Brand.belongsTo(State, {foreignKey: 'status_brand', as: 'state' });
    State.hasMany(Brand, {foreignKey: 'status_brand' });

    Category.belongsTo(State, {foreignKey: 'status_category', as: 'state' });
    State.hasMany(Category, {foreignKey: 'status_category' });

    Warehouse.belongsTo(State, {foreignKey: 'status_warehouse', as: 'state' });
    State.hasMany(Warehouse, {foreignKey: 'status_warehouse' });

    Provider.belongsTo(State, {foreignKey: 'status_provider', as: 'state' });
    State.hasMany(Provider, {foreignKey: 'status_provider' });

    Order.belongsTo(Warehouse, {foreignKey: 'source_order', as: 'warehouse' });
    Warehouse.hasMany(Order, {foreignKey: 'source_order' });
   
    Order.belongsTo(orderType, {foreignKey: 'type_order', as: 'ordertype' });
    orderType.hasMany(Order, {foreignKey: 'type_order' });
  
    Order.belongsTo(Warehouse, {foreignKey: 'destination_order', as: 'Warehouse' });
    Warehouse.hasMany(Order, {foreignKey: 'destination_order' });
   
    Movement.belongsTo(Product, {foreignKey: 'product_movement', as: 'product' });
    Product.hasMany(Movement, {foreignKey: 'product_movement' });
    
    

    Role.belongsToMany(Permission, {
      through: RolePerm,
      foreignKey: 'role_roleperm',
      otherKey: 'permission_roleperm',
      as: 'permissions'
    });
    
    Permission.belongsToMany(Role, {
      through: RolePerm,
      foreignKey: 'permission_roleperm',
      otherKey: 'role_roleperm',
      as: 'roles'
    });
  };

  
  // Inicializar modelos y relaciones
    initModels();

  module.exports = {
    sequelize,
    User,
    Role,
    Permission,
    RolePerm,
    Product,
    Brand,
    Category,
    Composition,
    Color,
    State,
    Warehouse,
    Provider,
    Order,
    Movement
    
   
  };
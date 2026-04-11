import sequelize from '../../config/database.js';
import { DataTypes } from 'sequelize';

import UserModel from './User.js';
import CategoryModel from './Category.js';
import ProductModel from './Product.js';
import OrderModel from './Order.js';
import OrderItemModel from './OrderItem.js';
import SettingModel from './Setting.js';

const User = UserModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const Product = ProductModel(sequelize, DataTypes);
const Order = OrderModel(sequelize, DataTypes);
const OrderItem = OrderItemModel(sequelize, DataTypes);
const Setting = SettingModel(sequelize, DataTypes);

// USER → ORDER
User.hasMany(Order, { foreignKey: 'UserId' });
Order.belongsTo(User, { foreignKey: 'UserId' });

// CATEGORY → PRODUCT
Category.hasMany(Product, { foreignKey: 'CategoryId' });
Product.belongsTo(Category, { foreignKey: 'CategoryId' });

// ORDER → ORDER ITEMS
Order.hasMany(OrderItem, { foreignKey: 'OrderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderId' });

// PRODUCT → ORDER ITEMS
Product.hasMany(OrderItem, { foreignKey: 'ProductId' });
OrderItem.belongsTo(Product, { foreignKey: 'ProductId' });

export {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Setting
};
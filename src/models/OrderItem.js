export default (sequelize, DataTypes) => {
  return sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
};
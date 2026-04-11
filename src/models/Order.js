export default (sequelize, DataTypes) => {
  return sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "shipped",
        "completed",
        "cancelled",
      ),
      defaultValue: "pending",
    },

    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    shippingAddress: {
      type: DataTypes.TEXT,
    },
  });
};

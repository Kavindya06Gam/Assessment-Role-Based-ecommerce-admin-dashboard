export default (sequelize, DataTypes) => {
  return sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      unique: true,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    sku: {
      type: DataTypes.STRING,
      unique: true,
    },

    imageUrl: {
      type: DataTypes.STRING,
    },
  });
};

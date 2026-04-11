export default (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
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

    description: {
      type: DataTypes.TEXT,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Category;
};

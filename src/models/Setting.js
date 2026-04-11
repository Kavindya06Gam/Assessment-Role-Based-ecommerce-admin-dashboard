export default (sequelize, DataTypes) => {
  return sequelize.define("Setting", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    value: DataTypes.TEXT,
    type: DataTypes.STRING,
    description: DataTypes.STRING,

    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

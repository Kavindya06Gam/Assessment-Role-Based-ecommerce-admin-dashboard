// src/models/Setting.js

export default (sequelize, DataTypes) => {
  const Setting = sequelize.define(
    "Setting",
    {
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

      value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "settings",
      timestamps: true,
    },
  );

  return Setting;
};

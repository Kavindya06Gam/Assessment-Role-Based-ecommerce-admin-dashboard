import bcrypt from "bcryptjs";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },

      password: DataTypes.STRING,

      role: {
        type: DataTypes.ENUM("admin", "user"),
        defaultValue: "user",
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      phone: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      hooks: {
        beforeValidate: (user) => {
          if (user.email) {
            user.setDataValue(
              "email",
              String(user.email).toLowerCase().trim(),
            );
          }
        },
        beforeCreate: async (user) => {
          if (user.password) {
            user.setDataValue(
              "password",
              await bcrypt.hash(user.password, 12),
            );
          }
        },
        beforeUpdate: async (user) => {
          if (!user.changed("password")) return;
          // AdminJS (and similar UIs) often submit an empty password on edit when
          // the operator is not changing it. Without this guard, the hash would be
          // overwritten with "" and login would always fail.
          if (!user.password) {
            const previous = user.previous("password");
            if (previous) user.setDataValue("password", previous);
            return;
          }
          user.setDataValue(
            "password",
            await bcrypt.hash(user.password, 12),
          );
        },
      },
    },
  );

  User.prototype.validatePassword = async function (plain) {
    if (!plain || !this.password) return false;
    return bcrypt.compare(plain, this.password);
  };

  return User;
};

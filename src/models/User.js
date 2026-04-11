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
        beforeCreate: async (user) => {
          user.password = await bcrypt.hash(user.password, 12);
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
      },
    },
  );

  User.prototype.validatePassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
  };

  return User;
};

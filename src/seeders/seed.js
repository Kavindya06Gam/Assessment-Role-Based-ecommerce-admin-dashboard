import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import sequelize from "../../config/database.js";

const seedDatabase = async () => {
  try {
    console.log(" Connecting to database...");
    // Sync ensures the tables exist before we try to insert data
    await sequelize.sync();

    const adminEmail = "admin@example.com";
    const adminPassword = "Admin@1234";

    // Check if the admin already exists to prevent primary key errors
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      console.log("Creating admin user...");

      // Hash the password using bcryptjs
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("-----------------------------------------------");
      console.log(" SUCCESS: Admin user created!");
      console.log(`Email: ${adminEmail}`);
      console.log(` Password: ${adminPassword}`);
      console.log("-----------------------------------------------");
    } else {
      console.log(" Notice: Admin user already exists in the database.");
    }

    process.exit(0);
  } catch (error) {
    console.error("ERROR: Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();

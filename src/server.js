import "dotenv/config";
import express from "express";
import session from "express-session";
import AdminJSExpress from "@adminjs/express";
import bcrypt from "bcryptjs"; // Ensure consistency with your seeder
import adminJs from "./admin/adminConfig.js";
import { sequelize, User } from "./models/index.js";

const app = express();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
  }),
);

// Build the Authenticated Router
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      const user = await User.findOne({
        where: { email: email.toLowerCase() },
      });
      if (user) {
        const matched = await bcrypt.compare(password, user.password);
        if (matched && user.role === "admin") {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      }
      return null;
    },
    cookieName: "adminjs_session",
    cookiePassword: process.env.COOKIE_PASSWORD || "complexpassword123",
  },
  null,
  { resave: false, saveUninitialized: true },
);

app.use(adminJs.options.rootPath, adminRouter);

app.get("/", (req, res) => res.redirect("/admin"));

const start = async () => {
  try {
    await sequelize.authenticate();
    // Use alter: true only in development to sync changes
    await sequelize.sync({ alter: true });
    app.listen(3000, () => console.log(" Server: http://localhost:3000/admin"));
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

start();

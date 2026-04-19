// 1. MUST BE FIRST: Load environment variables before any other imports
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import express from "express";
import session from "express-session";
import AdminJSExpress from "@adminjs/express";
import ConnectSessionSequelize from "connect-session-sequelize";
import adminJs from "./admin/adminConfig.js";
import { sequelize, User } from "./models/index.js";
import authRouter from "./routes/auth.js";
import apiRouter from "./routes/api.js";

const app = express();

// Setup Session Store
const SequelizeStore = ConnectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({ 
  db: sequelize,
  tableName: 'Sessions' // Explicit table name
});

// Build Authenticated Router
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      console.log("Auth Attempt:", email);
      try {
        const user = await User.findOne({
          where: { email: email.toLowerCase().trim() },
        });

        if (!user || !user.isActive) {
          console.log("User not found or inactive");
          return null;
        }

        const valid = await user.validatePassword(password);
        console.log("Password check:", valid ? "VALID" : "INVALID");

        if (!valid) {
          console.log("Access Denied: Invalid password");
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      } catch (err) {
        console.error("Auth Error:", err.message);
        return null;
      }
    },
    cookieName: "adminjs_session",
    cookiePassword: process.env.COOKIE_PASSWORD || "a_very_long_32_character_password_minimum",
  },
  null,
  {
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "another_very_long_32_char_secret_for_session",
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production behind HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }
);

// Mount AdminJS FIRST
app.use(adminJs.options.rootPath, adminRouter);

// Body parsers (must be after AdminJS so express-formidable isn't blocked)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', authRouter);
app.use('/api', apiRouter);

// Root Redirect
app.get("/", (req, res) => res.redirect("/admin"));

const start = async () => {
  try {
    // 1. Connect to DB
    await sequelize.authenticate();
    console.log("PostgreSQL connected");

    // 2. Sync Models & Session Store
    await sequelize.sync();
    await sessionStore.sync(); 
    console.log("Database & Sessions Synced");

    // 3. Start Listening
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Admin Panel: http://localhost:${port}/admin`);
    });
  } catch (error) {
    console.error("Critical Startup Error:", error);
  }
};

start();
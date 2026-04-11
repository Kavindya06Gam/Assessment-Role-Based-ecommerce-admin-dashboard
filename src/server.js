import express from "express";
import session from "express-session";

import adminJs from './admin/adminConfig.js';
import AdminJSExpress from "@adminjs/express";

const app = express();

// Middleware
app.use(express.json());

// Session (STEP 8 requirement)
app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);

// AdminJS router
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    // temporary login (you can improve later)
    if (email === "admin@example.com" && password === "Admin@1234") {
      return { email, role: "admin" };
    }
    return null;
  },
  cookiePassword: "cookie-secret-password",
});

app.use(adminJs.options.rootPath, adminRouter);

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("AdminJS: http://localhost:3000/admin");
});

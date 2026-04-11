import AdminJS from "adminjs";
import AdminJSSequelize from "@adminjs/sequelize";
// Import Models for the Dashboard logic
import { User, Product, Order } from "../models/index.js";
// Import Resource configurations
import {
  userResource,
  productResource,
  categoryResource,
  orderResource,
  orderItemResource,
  settingResource,
} from "./resources.js";

// Register the adapter so AdminJS understands Sequelize models
AdminJS.registerAdapter(AdminJSSequelize);

const adminJs = new AdminJS({
  rootPath: "/admin",

  // Resources Configuration
  resources: [
    userResource,
    productResource,
    categoryResource,
    orderResource,
    orderItemResource,
    settingResource,
  ],

  // Updated Branding
  branding: {
    companyName: "eCommerce Admin",
    withMadeWithLove: false,
    theme: {
      colors: {
        primary100: "#7b2ff7",
        accent: "#00d4ff",
      },
    },
  },

  // Dashboard Handler & Component
  dashboard: {
    handler: async (req, res, context) => {
      const { currentAdmin } = context;

      // Logic for Admin role
      if (currentAdmin?.role === "admin") {
        const [totalUsers, totalProducts, totalOrders] = await Promise.all([
          User.count(),
          Product.count(),
          Order.count(),
        ]);
        return { totalUsers, totalProducts, totalOrders };
      }

      // Logic for regular users/customers
      const myOrders = await Order.findAll({
        where: { UserId: currentAdmin.id },
      });
      const mySpent = myOrders.reduce(
        (s, o) => s + parseFloat(o.totalAmount || 0),
        0,
      );

      return {
        myOrders: myOrders.length,
        mySpent: mySpent.toFixed(2),
      };
    },
    component: AdminJS.bundle("./components/Dashboard.jsx"),
  },

  // Required for RBAC (Role-Based Access Control)
  currentAdmin: async (request) => {
    return request.session?.adminUser || null;
  },
});

export default adminJs;

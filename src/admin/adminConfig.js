import AdminJS, { ComponentLoader } from "adminjs";
import * as AdminJSSequelize from "@adminjs/sequelize";
import path from "path";
import { fileURLToPath } from "url";

// Models
import { User, Product, Order } from "../models/index.js";

// Resources
import {
  userResource,
  productResource,
  categoryResource,
  orderResource,
  orderItemResource,
  settingResource,
} from "./resources.js";

// --- Fix for Windows File Paths ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IMPORTANT: register adapter
AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const componentLoader = new ComponentLoader();

const Components = {
  // Use path.join with __dirname to ensure the path is absolute and valid on Windows
  Dashboard: componentLoader.add(
    "Dashboard",
    path.join(__dirname, "./components/Dashboard.jsx"),
  ),
};

const adminJs = new AdminJS({
  rootPath: "/admin",
  componentLoader,

  resources: [
    userResource,
    productResource,
    categoryResource,
    orderResource,
    orderItemResource,
    settingResource,
  ],

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

  dashboard: {
    component: Components.Dashboard,
    handler: async (req, res, context) => {
      const { currentAdmin } = context;

      if (currentAdmin?.role === "admin") {
        const [totalUsers, totalProducts, totalOrders] = await Promise.all([
          User.count().catch(() => 0),
          Product.count().catch(() => 0),
          Order.count().catch(() => 0),
        ]);

        return { totalUsers, totalProducts, totalOrders };
      }

      const myOrders = await Order.findAll({
        where: { UserId: currentAdmin?.id || 0 },
      }).catch(() => []);

      const mySpent = myOrders.reduce(
        (sum, o) => sum + Number(o.totalAmount || 0),
        0,
      );

      return {
        myOrders: myOrders.length,
        mySpent,
      };
    },
  },
});

export { adminJs, componentLoader };
export default adminJs;

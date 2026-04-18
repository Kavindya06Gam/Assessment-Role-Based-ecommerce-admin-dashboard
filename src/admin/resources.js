import {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Setting,
} from "../models/index.js";

// Import RBAC helper from your rbac file
import { isAdmin } from "./rbac.js";

/** Non-admins only see their own orders; enforced on list/search (filters cannot be bypassed). */
const scopeOrdersToCurrentUser = async (request, context) => {
  if (isAdmin(context)) return request;
  const uid = context.currentAdmin?.id;
  if (!uid) return request;
  const q = { ...(request.query || {}) };
  q["filters.UserId"] = String(uid);
  return { ...request, query: q };
};

/**
 * USER RESOURCE
 * Restricted to Admins only. Passwords hidden from UI.
 */
export const userResource = {
  resource: User,
  options: {
    navigation: { icon: "User", name: "User Management" },
    actions: {
      list: { isAccessible: isAdmin },
      show: { isAccessible: isAdmin },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
    },
    properties: {
      password: {
        isVisible: { list: false, filter: false, show: false, edit: true },
      },
    },
  },
};

/**
 * PRODUCT RESOURCE
 * Publicly viewable by all logged-in users; editable only by Admins.
 */
export const productResource = {
  resource: Product,
  options: {
    navigation: { icon: "Package", name: "Inventory" },
    actions: {
      list: { isAccessible: () => true }, // Accessible to any logged-in user
      show: { isAccessible: () => true },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
    },
  },
};

/**
 * CATEGORY RESOURCE
 */
export const categoryResource = {
  resource: Category,
  options: {
    navigation: { icon: "Grid", name: "Inventory" },
    actions: {
      list: { isAccessible: () => true },
      show: { isAccessible: () => true },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
    },
  },
};

/**
 * ORDER RESOURCE
 */
export const orderResource = {
  resource: Order,
  options: {
    navigation: { icon: "ShoppingCart", name: "Sales" },
    actions: {
      list: {
        isAccessible: () => true,
        before: scopeOrdersToCurrentUser,
      },
      search: {
        before: scopeOrdersToCurrentUser,
      },
      show: {
        isAccessible: ({ currentAdmin, record }) => {
          if (currentAdmin?.role === "admin") return true;
          const ownerId = record?.params?.UserId;
          return (
            ownerId != null &&
            Number(ownerId) === Number(currentAdmin?.id)
          );
        },
      },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
    },
  },
};

/**
 * ORDER ITEM RESOURCE
 */
export const orderItemResource = {
  resource: OrderItem,
  options: {
    navigation: { icon: "List", name: "Sales" },
    actions: {
      list: { isAccessible: isAdmin },
      show: { isAccessible: isAdmin },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
    },
  },
};

/**
 * SETTING RESOURCE
 */
export const settingResource = {
  resource: Setting,
  options: {
    navigation: { icon: "Settings", name: "Configuration" },
    actions: {
      list: { isAccessible: isAdmin },
      show: { isAccessible: isAdmin },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
    },
  },
};
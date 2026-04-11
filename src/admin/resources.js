// src/admin/resources.js

import {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Setting,
} from "../models/index.js";

//  Import RBAC helper (ONLY from rbac.js)
import { isAdmin } from "./rbac.js";

// =======================
//  USER RESOURCE (ADMIN ONLY)
// =======================
export const userResource = {
  resource: User,
  options: {
    actions: {
      list: { isAccessible: isAdmin },
      show: { isAccessible: isAdmin },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
    },
    properties: {
      password: { isVisible: false }, //  hide password everywhere
    },
  },
};

// =======================
//  PRODUCT RESOURCE
// Admin = full access
// User = read only
// =======================
export const productResource = {
  resource: Product,
  options: {
    actions: {
      list: { isAccessible: () => true }, // everyone
      show: { isAccessible: () => true }, // everyone
      new: { isAccessible: isAdmin }, // admin only
      edit: { isAccessible: isAdmin }, // admin only
      delete: { isAccessible: isAdmin }, // admin only
    },
  },
};

// =======================
//  CATEGORY RESOURCE
// =======================
export const categoryResource = {
  resource: Category,
  options: {
    actions: {
      list: { isAccessible: () => true },
      show: { isAccessible: () => true },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
    },
  },
};

// =======================
//  ORDER RESOURCE
// =======================
export const orderResource = {
  resource: Order,
  options: {
    actions: {
      list: { isAccessible: () => true },
      show: { isAccessible: () => true },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
    },
  },
};

// =======================
//  ORDER ITEM RESOURCE (ADMIN ONLY)
// =======================
export const orderItemResource = {
  resource: OrderItem,
  options: {
    actions: {
      list: { isAccessible: isAdmin },
      show: { isAccessible: isAdmin },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
    },
  },
};

// =======================
//  SETTING RESOURCE (ADMIN ONLY)
// =======================
export const settingResource = {
  resource: Setting,
  options: {
    actions: {
      list: { isAccessible: isAdmin },
      show: { isAccessible: isAdmin },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
    },
  },
};

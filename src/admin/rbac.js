// src/admin/rbac.js

export const isAdmin = (context) => {
  return context?.currentAdmin?.role === "admin";
};
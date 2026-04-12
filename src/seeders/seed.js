import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import sequelize from "../../config/database.js";
import {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Setting,
} from "../models/index.js";

const seed = async () => {
  try {
    console.log("Connecting and syncing...");
    await sequelize.sync({ force: true }); // Drops and recreates all tables

    // ── Users ────────────────────────────────────────────────────────────────
    // Pass plain password — the beforeCreate hook hashes it automatically
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: "Admin@1234", // plain text — hook will hash this
      role: "admin",
      isActive: true,
      phone: "+1-555-0100",
      address: "123 Admin Street",
    });

    const alice = await User.create({
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "User@1234",
      role: "user",
      isActive: true,
      phone: "+1-555-0101",
      address: "456 Oak Avenue",
    });

    const bob = await User.create({
      name: "Bob Smith",
      email: "bob@example.com",
      password: "User@1234",
      role: "user",
      isActive: true,
    });

    console.log("Users created");

    // ── Categories ────────────────────────────────────────────────────────────
    const electronics = await Category.create({
      name: "Electronics",
      slug: "electronics",
      description: "Gadgets and devices",
    });
    const clothing = await Category.create({
      name: "Clothing",
      slug: "clothing",
      description: "Apparel and fashion",
    });
    const books = await Category.create({
      name: "Books",
      slug: "books",
      description: "Physical and digital books",
    });

    console.log("Categories created");

    // ── Products ──────────────────────────────────────────────────────────────
    const p1 = await Product.create({
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      price: 79.99,
      stock: 150,
      sku: "ELEC-001",
      CategoryId: electronics.id,
    });
    const p2 = await Product.create({
      name: "Smart Watch",
      slug: "smart-watch",
      price: 199.99,
      stock: 75,
      sku: "ELEC-002",
      CategoryId: electronics.id,
    });
    const p3 = await Product.create({
      name: "Classic T-Shirt",
      slug: "classic-t-shirt",
      price: 24.99,
      stock: 500,
      sku: "CLTH-001",
      CategoryId: clothing.id,
    });
    const p4 = await Product.create({
      name: "Clean Code (Book)",
      slug: "clean-code-book",
      price: 34.99,
      stock: 200,
      sku: "BOOK-001",
      CategoryId: books.id,
    });

    console.log("Products created");

    // ── Orders ────────────────────────────────────────────────────────────────
    const order1 = await Order.create({
      orderNumber: "ORD-20240001",
      UserId: alice.id,
      status: "completed",
      totalAmount: 104.98,
      shippingAddress: alice.address,
    });
    await OrderItem.create({
      OrderId: order1.id,
      ProductId: p1.id,
      quantity: 1,
      unitPrice: 79.99,
      subtotal: 79.99,
    });
    await OrderItem.create({
      OrderId: order1.id,
      ProductId: p3.id,
      quantity: 1,
      unitPrice: 24.99,
      subtotal: 24.99,
    });

    const order2 = await Order.create({
      orderNumber: "ORD-20240002",
      UserId: bob.id,
      status: "pending",
      totalAmount: 199.99,
      shippingAddress: "789 Pine Road",
    });
    await OrderItem.create({
      OrderId: order2.id,
      ProductId: p2.id,
      quantity: 1,
      unitPrice: 199.99,
      subtotal: 199.99,
    });

    console.log("Orders and OrderItems created");

    // ── Settings ──────────────────────────────────────────────────────────────
    await Setting.bulkCreate([
      {
        key: "site_name",
        value: "My eCommerce Store",
        type: "string",
        description: "Public site name",
        isPublic: true,
      },
      {
        key: "currency",
        value: "USD",
        type: "string",
        description: "Default currency",
        isPublic: true,
      },
      {
        key: "tax_rate",
        value: "8.5",
        type: "number",
        description: "Tax rate percentage",
        isPublic: false,
      },
      {
        key: "maintenance_mode",
        value: "false",
        type: "boolean",
        description: "Toggle maintenance",
        isPublic: false,
      },
    ]);

    console.log("Settings created");

    console.log("\nSeed complete!");
    console.log("─────────────────────────────────────────");
    console.log("  Admin → admin@example.com / Admin@1234");
    console.log("  User  → alice@example.com / User@1234");
    console.log("─────────────────────────────────────────");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seed();

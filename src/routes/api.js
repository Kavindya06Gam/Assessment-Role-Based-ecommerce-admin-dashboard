import express from 'express';
import { Op } from 'sequelize';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { User, Product, Category, Order, OrderItem, Setting } from '../models/index.js';

const router = express.Router();

// ── Products (public read) ──────────────────────────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const where = { isActive: true };
    if (category) where.CategoryId = category;
    if (search)   where.name = { [Op.iLike]: `%${search}%` };

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
      limit:  parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order:  [['createdAt', 'DESC']],
    });

    return res.json({ success: true, total: count, page: parseInt(page), data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ['id', 'name'] }],
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── Orders (authenticated) ──────────────────────────────────────────────────
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const where   = isAdmin ? {} : { UserId: req.user.id };

    const orders = await Order.findAll({
      where,
      include: [
        { model: User,      attributes: ['id', 'name', 'email'] },
        { model: OrderItem, include: [{ model: Product, attributes: ['id', 'name', 'price'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User,      attributes: ['id', 'name', 'email'] },
        { model: OrderItem, include: [{ model: Product, attributes: ['id', 'name', 'price', 'imageUrl'] }] },
      ],
    });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Non-admins can only view their own orders
    if (req.user.role !== 'admin' && order.UserId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin-only: Users ───────────────────────────────────────────────────────
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
    return res.json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin-only: Settings ────────────────────────────────────────────────────
router.get('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await Setting.findAll({ order: [['key', 'ASC']] });
    return res.json({ success: true, data: settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/settings/:key', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await Setting.findOne({ where: { key: req.params.key } });
    if (!setting) return res.status(404).json({ success: false, message: 'Setting not found' });
    await setting.update({ value });
    return res.json({ success: true, data: setting });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin-only: Stats summary ───────────────────────────────────────────────
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, totalCategories] = await Promise.all([
      User.count(),
      Product.count(),
      Order.count(),
      Category.count(),
    ]);

    const revenueResult = await Order.findOne({
      attributes: [[Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'total']],
      where: { status: 'delivered' },
      raw: true,
    });

    const ordersByStatus = await Order.findAll({
      attributes: ['status', [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        revenue: parseFloat(revenueResult?.total || 0).toFixed(2),
        ordersByStatus,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

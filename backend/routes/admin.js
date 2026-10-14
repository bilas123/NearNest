const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const NeedRequest = require("../models/needRequest");

const router = express.Router();

// GET /api/admin/stats — platform overview & stats for evaluation
router.get("/stats", async (req, res) => {
  try {
    const [users, products, orders, needs] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      NeedRequest.countDocuments(),
    ]);

    const recentOrders = await Order.find()
      .populate("product", "title price")
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      counts: { users, products, orders, needs },
      recentOrders,
    });
  } catch (error) {
    console.error("Admin stats error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

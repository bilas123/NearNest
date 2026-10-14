const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/orders — buyer places an order request
router.post("/", auth, async (req, res) => {
  try {
    const { productId, rentalDays } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID. This item does not exist in the database (or is a preview demo item).",
      });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.status !== "available") return res.status(400).json({ message: "Product is no longer available" });
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't order your own product" });
    }

    // Calculate price
    let totalPrice = product.price;
    if (product.listingType === "donate") totalPrice = 0;
    if (product.listingType === "rent") totalPrice = product.price * (rentalDays || 1);

    const orderType = product.listingType === "sell" ? "buy" : product.listingType;

    const order = await Order.create({
      buyer: req.user._id,
      seller: product.seller,
      product: product._id,
      orderType,
      rentalDays: product.listingType === "rent" ? (rentalDays || 1) : 0,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders/my-orders — buyer's orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("product", "title image price listingType location")
      .populate("seller", "name email phone address")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders/seller-requests — seller's incoming requests
router.get("/seller-requests", auth, async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate("product", "title image price listingType location")
      .populate("buyer", "name email phone address")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Get seller requests error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/orders/:id/status — seller updates order status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["confirmed", "completed", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the seller can update order status" });
    }

    order.status = status;
    await order.save();

    // Mark product as reserved/completed if needed
    if (status === "confirmed") {
      await Product.findByIdAndUpdate(order.product, { status: "reserved" });
    }
    if (status === "completed") {
      await Product.findByIdAndUpdate(order.product, { status: "completed" });
    }
    if (status === "cancelled") {
      await Product.findByIdAndUpdate(order.product, { status: "available" });
    }

    res.json(order);
  } catch (err) {
    console.error("Update order status error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

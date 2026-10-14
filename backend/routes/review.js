const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/review");
const Order = require("../models/order");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/reviews — buyer submits rating and review for a completed order
router.post("/", auth, async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5 stars" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security check 1: Only the buyer can leave a review
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the buyer can review this order" });
    }

    // Security check 2: Order must be completed
    if (order.status !== "completed") {
      return res.status(400).json({ message: "You can only review completed orders" });
    }

    // Security check 3: Prevent duplicate review
    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this order" });
    }

    const review = await Review.create({
      order: order._id,
      buyer: req.user._id,
      seller: order.seller,
      product: order.product,
      rating: numRating,
      comment: (comment || "").trim(),
    });

    await review.populate("buyer", "name");
    await review.populate("product", "title");

    res.status(201).json(review);
  } catch (error) {
    console.error("Create review error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/reviews/seller/:sellerId — get reviews & calculated average for a seller
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid seller ID" });
    }

    const reviews = await Review.find({ seller: sellerId })
      .populate("buyer", "name")
      .populate("product", "title")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

    res.json({
      reviews,
      totalReviews,
      averageRating: Number(averageRating),
    });
  } catch (error) {
    console.error("Get seller reviews error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/reviews/my-reviews — list of order IDs already reviewed by buyer
router.get("/my-reviews", auth, async (req, res) => {
  try {
    const reviews = await Review.find({ buyer: req.user._id }).select("order rating comment");
    res.json(reviews);
  } catch (error) {
    console.error("Get my reviews error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

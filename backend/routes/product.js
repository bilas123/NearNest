const express = require("express");
const Product = require("../models/product");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/products — get all products (public, no login needed)
router.get("/", async (req, res) => {
  try {
    const { category, listingType, search } = req.query;
    const filter = { status: "available" };

    if (category) filter.category = category;
    if (listingType) filter.listingType = listingType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter)
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/products/:id — get single product (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products — create product (login required)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, price, listingType, category, condition, location, image } = req.body;

    if (!title || !description || !listingType || !category) {
      return res.status(400).json({ message: "Title, description, listing type, and category are required" });
    }

    const product = await Product.create({
      seller: req.user._id,
      title,
      description,
      price: listingType === "donate" ? 0 : price,
      listingType,
      category,
      condition,
      location,
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/products/:id — update product (only owner)
router.put("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own listings" });
    }

    const updates = req.body;
    Object.assign(product, updates);
    await product.save();

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/products/:id — delete product (only owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  listingType: {
    type: String,
    enum: ["sell", "rent", "donate"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ["Like New", "Good", "Fair"],
    default: "Good",
  },
  location: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["available", "reserved", "completed"],
    default: "available",
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

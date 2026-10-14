const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  orderType: { type: String, enum: ["buy", "sell", "rent", "donate"], required: true },
  rentalDays: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

// Schema for buyer "I Need This" community requests
const needRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Request title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    budget: {
      type: String,
      required: [true, "Budget or daily rate is required"],
      trim: true,
    },
    location: {
      type: String,
      default: "Campus / Nearby",
    },
    coordinates: {
      type: [Number], // [longitude, latitude] for geospatial distance
      default: undefined,
    },
    status: {
      type: String,
      enum: ["open", "fulfilled", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NeedRequest", needRequestSchema);

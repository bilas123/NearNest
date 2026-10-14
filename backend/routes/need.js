const express = require("express");
const mongoose = require("mongoose");
const NeedRequest = require("../models/needRequest");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/needs — get all open community requests (public)
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { status: "open" };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const needs = await NeedRequest.find(filter)
      .populate("requester", "name email")
      .sort({ createdAt: -1 });

    res.json(needs);
  } catch (error) {
    console.error("Get needs error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/needs — post a new request (login required)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, category, budget, location, coordinates } = req.body;

    if (!title || !description || !category || !budget) {
      return res.status(400).json({
        message: "Title, description, category, and budget are required",
      });
    }

    const need = await NeedRequest.create({
      requester: req.user._id,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      budget: budget.trim(),
      location: location || "Campus / Nearby",
      coordinates: Array.isArray(coordinates) && coordinates.length === 2 ? coordinates : undefined,
    });

    // Populate user info so frontend immediately has creator's name
    await need.populate("requester", "name email");

    res.status(201).json(need);
  } catch (error) {
    console.error("Create need error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/needs/:id — delete a request (only owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const need = await NeedRequest.findById(req.params.id);
    if (!need) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (need.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own requests" });
    }

    await need.deleteOne();
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Delete need error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

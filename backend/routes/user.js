const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");

const router = express.Router();

// PUT /api/users/location — update user coordinates
router.put("/location", auth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        location: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)],
        },
      },
      { returnDocument: "after" }
    ).select("-password -otp -otpExpires");

    res.json({ message: "Location updated successfully", location: user.location });
  } catch (error) {
    console.error("Update location error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/profile — update profile (name, phone, address, coordinates)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone, address, coordinates } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (address !== undefined) updates.address = address.trim();

    if (Array.isArray(coordinates) && coordinates.length === 2) {
      updates.location = {
        type: "Point",
        coordinates: [Number(coordinates[0]), Number(coordinates[1])],
      };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { returnDocument: "after" })
      .select("-password -otp -otpExpires");

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

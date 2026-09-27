const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "NearNest server is running" });
});

// Connect to MongoDB, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

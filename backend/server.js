const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/user");
const needRoutes = require("./routes/need");
const reviewRoutes = require("./routes/review");
const adminRoutes = require("./routes/admin");

// Load environment variables from .env
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Parse JSON request bodies (supports base64 image uploads)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "NearNest server is running" });
});

// Auth routes (register, verify-otp, login, me)
app.use("/api/auth", authRoutes);

// Product routes (CRUD)
app.use("/api/products", productRoutes);

// Order routes (create, my-orders, seller-requests, update status)
app.use("/api/orders", orderRoutes);

// User routes (location, profile)
app.use("/api/users", userRoutes);

// Need / Community request routes
app.use("/api/needs", needRoutes);

// Review & rating routes
app.use("/api/reviews", reviewRoutes);

// Admin / Evaluation routes
app.use("/api/admin", adminRoutes);

// Connect to MongoDB, auto-seed if empty, then start server
connectDB().then(async () => {
  try {
    const { seedIfEmpty } = require("./seed");
    await seedIfEmpty();
  } catch (seedErr) {
    console.warn("Auto-seed notice:", seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

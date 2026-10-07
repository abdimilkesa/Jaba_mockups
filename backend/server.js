require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const mockupRoutes = require("./routes/mockupRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "JABA MOCKUPS API is running",
  });
});

// Category routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/mockups", mockupRoutes);
// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

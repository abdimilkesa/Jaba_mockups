require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "JABA MOCKUPS API is running",
  });
});

// Category routes
app.use("/api/categories", categoryRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

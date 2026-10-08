require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const mockupRoutes = require("./routes/mockupRoutes");

const app = express();
const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

connectDB().catch((error) => {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
});

const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(v => v.trim()) : true;
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadDir));

app.get("/", (req, res) => res.json({ message: "JABA MOCKUPS API is running" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", service: "jaba-mockups-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/mockups", mockupRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ message: "File is too large. Maximum size is 500MB." });
  res.status(400).json({ message: err.message || "Request failed" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

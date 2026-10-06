require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    console.log("Database:", mongoose.connection.name);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  });

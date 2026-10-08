require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = "admin@jabamockups.com";
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists:", email);
      return;
    }
    const password = "Admin12345";
    const admin = await User.create({ name: "JABA Admin", email, password: await bcrypt.hash(password, 10), role: "admin" });
    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();

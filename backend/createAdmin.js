require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const adminExists = await User.findOne({
      email: "admin@jabamockups.com",
    });

    if (adminExists) {
      console.log("Admin already exists");
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin12345", 10);

    const admin = await User.create({
      name: "JABA Admin",
      email: "admin@jabamockups.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
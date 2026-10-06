const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set. Add it to backend/.env.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully");
};

module.exports = connectDB;

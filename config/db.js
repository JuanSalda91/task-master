// 1. import mongoose so we can connect to MongoDB
const mongoose = require("mongoose");

// 2. define an async function that connects to mongoDB
const connectDB = async () => {
  try {
    // user the connection string in .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connected.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", error.message);
    // exit the app with failure code if DB cannot connect
    process.exit(1);
  }
};

// 3. export function so server.js can call it
module.exports = connectDB;

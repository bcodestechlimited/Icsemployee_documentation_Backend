const mongoose = require("mongoose");
require("dotenv").config();

const isDev = process.env.NODE_ENV === "development";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      dbName: isDev ? "ICSEmployee-Staging" : "ICSEmployee",
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;

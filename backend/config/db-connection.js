const mongoose = require('mongoose');
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`MongoDB Connected Error: ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
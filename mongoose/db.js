const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connected = await mongoose.connect(process.env.DATABASE_MONGO_URL);
    console.log("connectDB: ", connected.connection.host);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
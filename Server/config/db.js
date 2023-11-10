const mongoose = require("mongoose");
const DB_URL = process.env.MongoDB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: { w: "majority" },
    });
    console.log("connected to MongoDB");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
